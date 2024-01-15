import React, { useEffect, useState } from 'react'
import "../Styles/Login.css" 
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate('');
    const { login } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
      
        if (!email || !password) {
          setError("Please fill all the required fields");
          return;
        }
      
        const data = {
          email: email,
          password: password
          
        };
        
        try {
      await login(email, password);
      setError('');
      alert('Login successful');
      navigate('/addtrip');
      setIsLoggedIn(true);
    }
     catch (error) {
      setError('Login failed. Please check your credentials.');
    }
    
  };

      
   
  return (
    <div className='login-container'>
        <h1 className='login-title'>Login to TaxTim</h1>
        <div className='login-recover'>
            <h2 className='login-data'>To backup your data, login here</h2>
        </div>
        <div className='login-label'>
                <label>Email
                </label>
            </div>
            <form onSubmit={handleLogin}>
            <div className='login-input'>
            <input placeholder='Enter Email' type="email" required  value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='login-label'>
                <label>Password
                </label>
            </div>
            <div className='login-input'>
            <input placeholder='Enter Password' type="password" required  value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className='forget'>
                <Link to="/forgetpass" className='forget-pass'>
                Forget password?
                </Link>
            </div>
            <div>
                <p>{error}</p>
            </div>
            <div className='login-button-cont'>
                <button type='submit' className='login-button'>Login</button>
            </div>
            </form>
            <div>
                <p className='register'>Don't have a TaxTim account?<Link to="/signup" className='signup-register'>Register here</Link></p>
            </div>
            <h3 className="login-version">Latest Version 1.6.3</h3>
    </div>
  )
}
