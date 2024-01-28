// authActions.js
import axios from 'axios';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './authActionTypes';

export const login = (email, password) => async (dispatch) => {
  try {
    const api = await axios.post('https://logbook-emwv.onrender.com/login', {
      email,
      password,
    });

    if (api.data.token) {
      localStorage.setItem('token', api.data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: api.data.user });
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT_SUCCESS });
};
