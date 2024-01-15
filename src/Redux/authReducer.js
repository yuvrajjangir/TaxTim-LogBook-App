// authReducer.js
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './authActionTypes';

const initialState = {
  isAuth: false,
  user: {}
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuth: true,
        user: action.payload
      };
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state;
  }
};

export default authReducer;
