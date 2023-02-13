// Create express app
import express from "express";

import db from "./database.js";

import md5 from "md5";

import bodyParser from "body-parser";

import cors from 'cors';

import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();

// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

//Get all users endpoint
app.get("/api/users", (req, res, next) => {
    const sql = "select * from UserData";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});



//Get specific user by id endpoint
app.get("/api/user/:id", (req, res, next) => {
    const sql = "select * from UserData where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

//Patch a specific user
app.patch("/api/user/:id", (req, res, next) => {
    const data = {
        email: req.body.email,
        password : req.body.password,
        role : req.body.role,
        storeId: req.body.storeId
    }
    db.run(
        `UPDATE UserData set 
           email = COALESCE(?,email), 
           password = COALESCE(?,password)
           role = COALESCE(?,role)
           storeId = COALESCE(?,storeId)
           WHERE id = ?`,
        [data.email, data.password, data.role, data.storeId, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})

app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM UserData WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})


//Post a new user endpoint
app.post("/api/user", (req, res, next) => {
    const errors=[];
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        email: req.body.email,
        password : md5(req.body.password),
        role: req.body.role,
    }
    const sql ='INSERT INTO UserData (email, password, role) VALUES (?,?,?)'
    const params =[data.email, data.password, data.role]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

//Get all products endpoint
app.get("/api/product", (req, res, next) => {
    const sql = "select * from ProductData";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

//Get specific product by id endpoint
app.get("/api/product/:id", (req, res, next) => {
    const sql = "select * from ProductData where id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

//get specific store by id
app.get("/api/store/:id", (req, res, next) => {
    const sql = "select * from StoreData where uniqueStoreId = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

//get all stores by id
app.get("/api/store", (req, res, next) => {
    const sql = "select * from StoreData";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

//get all products in a specific store
app.get("/api/store/:id/product", (req, res, next) => {
    const sql = "select * from ProductData where storeId = ?";
    const params = [req.params.id];
    db.all(sql, params, (err, rows) => {
    if (err) {
    res.status(400).json({"error":err.message});
    return;
    }
    res.json({
    "message":"success",
    "data":rows
    })
    });
    });

const secretKey = process.env.SECRET_KEY;

app.post("/api/user/login", (req, res, next) => {
    const errors = [];
    if (!req.body.email) {
    errors.push("No email specified");
    }
    if (!req.body.password) {
    errors.push("No password specified");
    }
    if (errors.length) {
    res.status(400).json({"error": errors.join(",")});
    return;
    }
    
    const sql = "SELECT * FROM UserData WHERE email = ? AND password = ?";
    const params = [req.body.email, md5(req.body.password)];
    
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        if (!row) {
            res.status(401).json({"error": "Invalid login credentials"});
            return;
        }

        const token = jwt.sign({ id: row.id, email: row.email }, secretKey, { expiresIn: "1h" });

        res.json({
            "message": "success",
            "data": row,
            "token": token
        });
        next();
    });
    });


// Middleware function to check if the user is authenticated
const checkAuth = (req, res, next) => {
    // Get the token from the Authorization header
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    const token = req.headers.authorization.split(' ')[1];

    // If no token is provided, return an error
    if (!token) {
        return res.status(401).json({ "error": "Not authorized" });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ "error": "Not authorized" });
    }

    next();
};
    
    // Endpoint to get the current logged in user
    app.get("/api/user", checkAuth, (req, res, next) => {
        res.json({
        "message": "success",
        "data": req.user
        });
    });

//get all with storeId :something

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
