import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGOUT_USER, LOGOUT_USER_SUCCESS, FORGET_PASSWORD, API_ERROR } from './actionTypes';

export const loginUser = (user) => {
  return {
    type: LOGIN_USER,
    payload: user
  }
}

export const loginUserSuccess = (user) => {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: user
  }
}

export const logoutUser = () => {
  return {
    type: LOGOUT_USER    
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS    
  }
}

export const forgetPassword = (email) => {
  return {
    type: FORGET_PASSWORD,
    payload: email
  }
}

export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: error
  }
}
