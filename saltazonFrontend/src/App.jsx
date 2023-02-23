import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

import NavBar from './components/Navbar.jsx';
import Cart from './components/checkout/Cart.jsx';
import AdminPage from "./admin/AdminPage.jsx";
import ProfileBar from "./components/ProfileBar.jsx";
import ProductList from './components/Products/ProductList.jsx';
import LoginForm from './components/login/LoginForm.jsx';
import NewUserForm from './components/login/NewUserForm.jsx';
import SuperAdminPage from "./admin/SuperAdminPage.jsx";

function getCurrentCart() {
    const id = localStorage.getItem('id')
    const cart = localStorage.getItem(`cart_${id}`);
    return cart ? JSON.parse(cart) : [];
    //update to get from localstorage
}


function App() {
    const [currentCart, setCurrentCart] = useState(getCurrentCart());
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/product')
            .then(res => setProducts(res.data.data))
            .catch(err => console.log(err));
    }, []);

    function addToCart(productId) {
        console.log("Add " + productId + " From the App")
        const id = localStorage.getItem('id');
        const product = products.find(p => p.id === productId);
        setCurrentCart(prevCart => {
            const existingCartItem = prevCart.find(item => item.id === productId);
            let newCart;
            if (existingCartItem) {
                newCart = prevCart.map(item => item.id === productId ? {...item, amount: item.amount + 1} : item);
            } else {
                newCart = [...prevCart, {...product, amount: 1}];
            }
            localStorage.setItem(`cart_${id}`, JSON.stringify(newCart));
            return newCart;
        });
    }
    
      
    function removeFromCart(productId) {
        console.log("Remove " + productId + " From the App")
        const id = localStorage.getItem('id');
        const cart = localStorage.getItem(`cart_${id}`);
        if (cart) {
          const currentCart = JSON.parse(cart);
          const index = currentCart.findIndex(p => p.id === productId);
          if (index !== -1) {
            const product = currentCart[index];
            if (product.amount > 1) {
              product.amount -= 1;
              setCurrentCart([...currentCart]);
              localStorage.setItem(`cart_${id}`, JSON.stringify(currentCart));
            } else {
              currentCart.splice(index, 1);
              setCurrentCart(currentCart);
              localStorage.setItem(`cart_${id}`, JSON.stringify(currentCart));
            }
          }
        }
    }

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
                    <Route exact path='/admin' element={< AdminPage products={products} />}></Route>
                    <Route exact path='/admin/super' element={< SuperAdminPage />}></Route>
                </Routes>
            </Router>
        </div>
    )
}

export default App;
