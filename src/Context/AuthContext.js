// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const api = await axios.get('https://logbook-emwv.onrender.com/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(api.data);
        }
      } catch (error) {
        console.log("Authentication error:", error);
      }

      setLoading(false);
    };

    checkAuth();
  }, []); // Make sure the dependency array is empty to run only once on mount

  const login = async (email, password) => {
    try {
      const api = await axios.post('https://logbook-emwv.onrender.com/login', {
        email,
        password,
      });

      if (api.data.token) {
        localStorage.setItem('token', api.data.token);
        setUser(api.data.user);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const api = await axios.post('https://logbook-emwv.onrender.com/signup', {
        name,
        email,
        password,
      });

      console.log('API Response:', api);

      if (api.data === 'Singup successful') {
        setUser(api.data.user);
      } else {
        console.error('Unexpected signup response:', api.data);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      throw error; // Re-throw the error to propagate it to the calling code
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
