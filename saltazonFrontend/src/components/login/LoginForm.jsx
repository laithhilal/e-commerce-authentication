import axios from 'axios';
import React, { useState } from 'react';

function LoginForm() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        setPassword('');
      })
      .catch((error) => {
        console.error("Email or Password is Incorrect", error);
        setPassword('');
      });
  };

  return (
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
      {token && (
        <>
          <p>Token: {token}</p>
          <button
            onClick={() => {
              axios
                .get("http://localhost:8000/api/user", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((response) => {
                  console.log(response.data);
                })
                .catch((error) => {
                  console.error("Could not fetch user data", error);
                });
            }}
          >
            Fetch User Data
          </button>
        </>
      )}
    </>
  );
}

export default LoginForm;
