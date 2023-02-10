import axios from 'axios';

function NewUserForm() {

const onSubmit = (e) => {
  e.preventDefault();
  const email = e.target.email_input.value;
  const password = e.target.password_input.value;
  const confirmedPassword = e.target.confirmed_password_input.value;
  const role = e.target.type_input.value;
  
  if (!email) {
    console.error("Email field is required");
    return;
  }
  
  if (!password) {
    console.error("Password field is required");
    return;
  }
  
  if (password !== confirmedPassword) {
    console.error("Password and Confirm Password fields do not match");
    e.target.password_input.value = '';
    e.target.confirmed_password_input.value = '';
    return;
  }
  
  const data = { email, password, role };
  
  axios
    .post("http://localhost:8000/api/user", data)
    .then((response) => {
      console.log(response.data);
      e.target.password_input.value = '';
      e.target.confirmed_password_input.value = '';
    })
    .catch((error) => {
    console.error("There was a problem with the Axios POST operation:", error);
    });
  };
  
  return (
      <>
        <h3>Create new user</h3>
        <form onSubmit={onSubmit} className={"create_user_form"}>
          <label htmlFor="email_input">Email</label>
          <input required placeholder={"email"} id={"email_input"}/>
          <br/>
          <label htmlFor="password_input">Password</label>
          <input required placeholder={"password"} id={"password_input"}/>
          <br/>
          <label htmlFor="confirmed_password_input">Confirm password</label>
          <input required placeholder={"confirm password"} id={"confirmed_password_input"}/>
          <br/>
          <label htmlFor="type_input">Type of User</label>
          <select placeholder={"user"} id={"type_input"}>
            <option value={"user"}>User</option>
            <option value={"admin"}>Admin</option>
          </select>
          <br/>
          <input type={'submit'}/>
        </form>
      </>
  )
}

export default NewUserForm;