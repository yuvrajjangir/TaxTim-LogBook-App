import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Logbookapp.css";
import { useAuth } from "../Context/AuthContext";


const LogBookApp = () => {
  const { user, logout } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logbookStats, setLogbookStats] = useState({
    totalKilometers: 0,
    businessKilometers: 0,
    totalExpenseCost: 0,
    totalLitersBought: 0,
  });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
      navigate('/login') 
  };

  const handleLogout = (e) => {
    logout();
    setIsLoggedIn(false);
    setShowDropdown(false);
    alert("User logged out");
    setLogbookStats({
      totalKilometers: 0,
      businessKilometers: 0,
      totalExpenseCost: 0,
      totalLitersBought: 0,
    });
    e.preventDefault();
  };

 
  const handleclick = () => {
    setClicked(!clicked);
  };

  

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn based on whether there is a token
  };

  const closeDropdown = (event) => {
    if (!event.target.matches('.dropbtn')) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => {
      window.removeEventListener('click', closeDropdown);
    };
  }, []);

  
  useEffect(() => {
    checkLoginStatus();
  }, [user]);
  
  // Prevent the default behavior of event propagation when clicking inside the dropdown content
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const backgroundImageUrl = "https://i.ytimg.com/vi/nAFLsldyJfs/maxresdefault.jpg";

  // Styles for background image
  const backgroundStyles = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <>
      <div className="top-nav1" >
      <div className="logbook-image" >
          <Link to="/addtrip">
            <img
              src="https://logbook.taxtim.com/img/logbook-logo.svg"
              alt=""
            />
          </Link>
        </div>
        <div
          id="navbar-link"
          className={clicked ? "navbar-link active" : "navbar-link"}
        >
          <div className="some1">
            <Link className="link1" to="/trips">
              Trips
            </Link>
          </div>
          <div className="some1">
            <Link className="link1" to="/location">
              Locations
            </Link>
          </div>
          <div className="some1">
            <Link className="link1" to="/expenses">
              Expenses
            </Link>
          </div>
          <div className="some1">
            <Link className="link1" to="/stats">
              Logbook Stats
            </Link>
          </div>
          <div className="some1">
            <Link className="link1" >
              Cars
            </Link>
          </div>
          <div className="some1">
            <Link className="link1" >
              How it works
            </Link>
          </div>
          <div class="some1 line" >
             <span class="link1"></span>
          </div>
          <div className="dropdown">
      <button onClick={toggleDropdown} className="dropbtn">
        Backup and Sync <span  className="arrow">&#9660;</span>
      </button>
      {showDropdown && (
        <div  className="dropdown-content" onClick={stopPropagation}>
         {isLoggedIn ? (
              // If logged in, show logout button
              <button style={{border:"none", backgroundColor:"#007499", color:"white", marginLeft:"5rem", fontWeight:"700", cursor:"pointer"}} className="logout-btn" onClick={handleLogout}>Logout</button>
              
            ) : (
              // If not logged in, show login link
              <Link className="login-btn" to="/login">Login</Link>
              
              
            )}
        </div>
      )}
    </div>
        </div>
        <div id="mobile" onClick={handleclick}>
          <i
          id="bar"
          className={clicked ? "fas fa-times" : "fas fa-bars"}>
          </i>
        </div>
      </div>

      {/* <i
            id="bar"
            className={clicked ? "fas fa-times" : "fas fa-bars"}
          ></i> */}




      {/* now the content of trips goes here  */}

     <div className="trips" >
      {!isLoggedIn && (
        <div className="alert-box">
          <div className="alert">
            ⚠️ To view, export, and back up your trips,{' '}
            <span onClick={handleLogin} style={{ fontWeight:"700", cursor: 'pointer', textDecoration: 'none' }}>
              log in here
            </span>
          </div>
        </div>
      )}
    </div>
      </>
  );
};

export default LogBookApp;

