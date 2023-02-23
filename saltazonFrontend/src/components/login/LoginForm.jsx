import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [email, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const onSubmit = e => {
    e.preventDefault();
    const email = e.target.email_input.value;
    const password = e.target.password_input.value;

    if (!email) {
      console.error("Email field is required");
      return;
    }

    if (!password) {
      console.error("Password field is required");
      return;
    }

    const data = { email, password };
    axios
      .post("http://localhost:8000/api/user/login", data)
      .then((response) => {
        console.log(response.data);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('id', response.data.data.id)
        localStorage.setItem('role', response.data.data.role)
        setPassword('');
        navigate('/');
      })
      .catch((error) => {
        console.error("Email or Password is Incorrect", error);
        setPassword('');
      });
      setTimeout(() => {
        window.location.reload();
      }, 200);
  };


  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setCurrentUser(response.data.data);
        })
        .catch(error => {
          console.error("Error getting user", error);
        });
    }
  }, [token]);

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('id')
    localStorage.removeItem('role')
    window.location.reload();
  };

  return (
    <>
      {!token && (
        <>
      <h3>Login</h3>
      <form onSubmit={onSubmit} className={"login_form"}>
        <label htmlFor="email_input">Email</label>
        <input required placeholder={"email"} id={"email_input"} value={email} onChange={e => setEmail(e.target.value)} />
        <br />
        <label htmlFor="password_input">Password</label>
        <input required placeholder={"password"} id={"password_input"} value={password} onChange={e => setPassword(e.target.value)} />
        <br />
        <input type={"submit"} />
      </form>
        </>
      )}
      {token && (
        <>
        <p>Already logged in as {currentUser.email}</p>
        <button onClick={onLogout}>Logout</button>
        </>
      )}
    </>
  );
}

export default LoginForm;
