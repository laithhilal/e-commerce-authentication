import axios from 'axios';
import React, { useState } from 'react';

function LoginForm() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState(localStorage.getItem('email') || '');

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
        setPassword('');
        setLoggedInEmail(email);
        localStorage.setItem('email', loggedInEmail)
      })
      .catch((error) => {
        console.error("Email or Password is Incorrect", error);
        setPassword('');
      });
  };

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
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
        <p>Already logged in as {loggedInEmail.split('@')[0]}</p>
        <button onClick={onLogout}>Logout</button>
        </>
      )}
    </>
  );
}

export default LoginForm;
