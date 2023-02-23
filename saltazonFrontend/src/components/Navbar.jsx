import {Link} from 'react-router-dom';

function NavBar() {

  const role = localStorage.getItem('role')

  return (
      <nav className={"navbar"}>
        <ul>
          <li>
            <Link to={'/'} className={"nav_button"}>SHOW ME ALL THE ITEMS</Link>
          </li>
          <li>
            <Link to={'/login'} className={"nav_button"}>Login/Logout</Link>
          </li>
          <li>
            <Link to={'/create-new-user'} className={"nav_button"}>Create new user</Link>
          </li>
          <li>
            <Link to={'/cart'} className={"nav_button"}>Go to cart</Link>
          </li>
          {role === 'admin' && (
          <li>
            <Link to={'/admin'} className={'nav_button'}>
              Admin
            </Link>
          </li>
          )}
        </ul>
      </nav>
  )
}

export default NavBar;