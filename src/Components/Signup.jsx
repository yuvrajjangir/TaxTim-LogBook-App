import React, { useState } from 'react'
import "../Styles/Signup.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate('');
    const { signup } = useAuth();


    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if(!name || !email || !password){
            setError("Please fill all the required fields");
            return;
        }
        try {
            await signup(name, email, password);
            alert("Signup successful");
            navigate("/login");
            // console.log(api);
        } catch (error) {
            setError("Signup failed. Please check your details and try again.");
        }
    }
  return (
    <div className='signup-container'>
        <h1 className='signup-title'>Register to TaxTim</h1>
        <div className='signup-label'>
                <label>Name
                </label>
            </div>
            <div className='signup-input'>
            <input placeholder='Enter Name' type="text" required value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='signup-label'>
                <label>Email
                </label>
            </div>
            <div className='signup-input'>
            <input placeholder='Enter Email' type="text" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='signup-label'>
                <label>Password
                </label>
            </div>
            <div className='signup-input'>
            <input placeholder='Enter Password' type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div>
                <p>{error}</p>
            </div>
            <div className='signup-button-cont'>
                <button type='submit' className='signup-button' onClick={handleSubmit}>Signup</button>
            </div>
            <div>
                <p className='register'>Do you have TaxTim account?<Link to="/login" className='login-register'>Login here</Link></p>
            </div>
            <h3 className="signup-version">Latest Version 1.6.3</h3>
    </div>
  )
}
