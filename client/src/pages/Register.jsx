import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'


const Register = () => {
  const [userData,setUserData]=useState({
    name:'',
    email:'',
    password:'',
    password2:''
  })
  const navigate=useNavigate();

  const [error,setError]=useState('')
  

  const changeInputHandler=(e)=>{
    setUserData(prevState=>{
      return{...prevState,[e.target.name]:e.target.value}
    })
  }
  
  const registerUser = async (e) => {
    e.preventDefault();
    setError('')
    try {
      const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`,userData)
      const newUser=await response.data;
      if(!newUser){
        setError("couldn't  register")
      }else{
        console.log(newUser);
      }
      navigate('/login')
    } catch (error) {
      setError(error.response.data.message)
    }
  };
  return (
    <section className="register">
      <div className="container">
        <h2>Sign up</h2>
        <form action="" className="form register__form" onSubmit={registerUser}>
          {error &&<p className="form__error-message">{error}</p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler} autoFocus/>
          <input type="text" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange={changeInputHandler} />
          <button type="submit" className='btn primary'>Register</button>
        </form>
        <small>Already have an account?<Link to='/login'>Sign in</Link></small>
      </div>
    </section>
  )
}

export default Register
