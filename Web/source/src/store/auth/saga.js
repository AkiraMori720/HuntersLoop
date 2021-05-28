import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

import { LOGIN_USER, LOGOUT_USER, FORGET_PASSWORD } from './actionTypes';
import { loginUserSuccess, logoutUserSuccess, apiError } from './actions';

import { getFirebaseBackend } from '../../helpers/firebase_helper';
import { getFirestoreBackend } from '../../helpers/firestore_helper';

const fireBaseBackend = getFirebaseBackend();
const fireStoreBackend = getFirestoreBackend();

function* loginUser({payload}) {  
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.loginUser, payload.email, payload.password);      
      const registeredUser = yield call(fireStoreBackend.getUser, response.uid);
      localStorage.setItem("authUser", JSON.stringify(registeredUser));
      yield put(loginUserSuccess(registeredUser));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {

    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {

    }    
  } catch (error) {    
    yield put(apiError(error));
  }
}

function* forgetPassword({payload}){
  try{
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = yield call(fireBaseBackend.forgetPassword, payload);            
    }
  }
  catch(error){
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("roomChatFeatureArrs");

    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = yield call(fireBaseBackend.logout);      
      yield put(logoutUserSuccess(response));
    }    
  } catch (error) {
    yield put(apiError(error));
  }
}

export function* watchUserLogin() {
  yield takeEvery(LOGIN_USER, loginUser)
}

export function* watchForgetPassword(){
  yield takeEvery(FORGET_PASSWORD, forgetPassword)
}

export function* watchUserLogout() {
  yield takeEvery(LOGOUT_USER, logoutUser)
}

function* loginSaga() {
  yield all([
    fork(watchUserLogin),
    fork(watchUserLogout),
    fork(watchForgetPassword)
  ]);
}

export default loginSaga;