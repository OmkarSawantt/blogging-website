import React, { useState ,useContext } from 'react'
import {Link} from "react-router-dom"
import Logo from '../Images/logo.png'
import {FaBars} from 'react-icons/fa'
import {AiOutlineClose} from 'react-icons/ai'
import {UserContext} from '../context/userContext'
import Search from './search'

const Header = () => {
  const [isNavShowing,setIsNavShowing]=useState(window.innerWidth > 800 ? true : false);
  const {currentUser}=useContext(UserContext)
  const closeNavHandler=()=>{
    if(window.innerWidth < 800){
      setIsNavShowing(false);
    }else{
      setIsNavShowing(true);
    }
  }
  return (
<nav>
  <div className="container nav__container">
    <Link to="/" className='nav__logo'>
      <img src={Logo} alt="NavbarLogo" className='nav__logo-image'  />
    </Link>
    <Search></Search>
    {currentUser?.id && isNavShowing &&<ul className="nav__menu">
      <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link></li>
      <li><Link to="/create" onClick={closeNavHandler}>Create Post</Link></li>
      <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
      <li ><Link to="/logout" onClick={closeNavHandler} className='loging'>Logout</Link></li>
    </ul>}
    {!currentUser?.id && isNavShowing &&<ul className="nav__menu">
      <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
      <li ><Link to="/login" onClick={closeNavHandler}className='loging'>Login</Link></li>
    </ul>}
    <button className="nav__toggle-btn" onClick={()=>setIsNavShowing(!isNavShowing)}>
      {isNavShowing ? <AiOutlineClose style={{color:'#f2f2ff',fontSize:'2rem', strokeWidth:10}}/> :<FaBars style={{color:'#f2f2ff',fontSize:'2rem', strokeWidth:10}}/>}

    </button>
  </div>
</nav>
  )
}

export default Header
