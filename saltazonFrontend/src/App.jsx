import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

import {fakecart} from './fakedata/fakecart.js';
import NavBar from './components/Navbar.jsx';
import Cart from './components/checkout/Cart.jsx';
import AdminPage from "./admin/AdminPage.jsx";
import ProfileBar from "./components/ProfileBar.jsx";
import ProductList from './components/Products/ProductList.jsx';
import LoginForm from './components/login/LoginForm.jsx';
import NewUserForm from './components/login/NewUserForm.jsx';
import SuperAdminPage from "./admin/SuperAdminPage.jsx";

function getCurrentCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : fakecart;
    //update to get from localstorage
}


function App() {
    const [currentCart, setCurrentCart] = useState([getCurrentCart()]);
    const [products, setProducts] = useState([]);

    function addToCart(productId) {
        console.log("Add " + productId + " From the App")
        //add item to the current Cart
    
        // Find the product with the matching productId
        const product = products.find(p => p.id === productId);
    
        // Clone the current cart array and add the new product to it
        const newCart = [...currentCart, product];
    
        // Update the currentCart state with the new cart array
        setCurrentCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    }

    function removeFromCart(productId) {
        console.log("Remove " + productId + " From the App")
        //remove item from the current Cart
    
        // Clone the current cart array and filter out the product with the matching productId
        const newCart = currentCart.filter(p => p.id !== productId);
    
        // Update the currentCart state with the new cart array
        setCurrentCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    }
    
    useEffect(() => {
        axios.get('http://localhost:8000/api/product')
            .then(res => setProducts(res.data.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="App">
            <Router>
                <header className={"top_header"}>
                    <ProfileBar/>
                    <NavBar/>
                </header>
                <Routes>
                    <Route exact path='/create-new-user' element={< NewUserForm/>}></Route>
                    <Route exact path='/login' element={< LoginForm/>}></Route>
                    <Route exact path='/'
                           element={< ProductList products={products} addToCart={addToCart}/>}></Route>
                    <Route exact path='/cart'
                           element={< Cart products={currentCart} removeFromCart={removeFromCart}/>}></Route>
                    <Route exact path='/admin' element={< AdminPage/>}></Route>
                    <Route exact path='/admin/super' element={< SuperAdminPage/>}></Route>
                </Routes>
            </Router>
        </div>
    )
}

export default App;
