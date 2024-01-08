import React, { useEffect, useState } from 'react'
import "../Styles/Login.css" 
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate('');
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
          const api = await axios.post('https://zany-red-cockatoo.cyclic.app/login', data);
          console.log(api.data);
      
          if (api.data.token) {
            setError(''); // Clear any previous errors
            localStorage.setItem('token', api.data.token);
            setIsLoggedIn(true);
            alert("Login successful");
            navigate('/addtrip');
          } else {
            setError('Login failed. Please check your credentials.');
          }
        } catch (error) {
          console.log("Login error:", error);
          if (error.response) {
            if (error.response.status === 401) {
              setError('Wrong email or password. Please try again.'); // Handle 401 status (Unauthorized) - Wrong credentials
            } else if (error.response.status === 404) {
              setError('User not found.'); // Handle 404 status - User not found
            } else if (error.response.status === 500) {
              setError('Server error. Please try again later.'); // Handle 500 status - Server error
            } else {
              setError('An error occurred during login.'); // Handle other response errors
            }
          } else {
            setError('An error occurred during login.'); // Handle other types of errors
          }
        }
      };
      
      
      
      
    useEffect(() => {
        // Check if the user is logged in (example: checking localStorage for a token)
        const token = localStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }, []);

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
