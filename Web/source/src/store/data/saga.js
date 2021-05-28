import { all, call, fork, takeEvery, put } from "redux-saga/effects";

import {
  GET_DATA,
  GET_DATA_SUCCESS,
  GET_DATA_ERROR,
  SET_DATA,
  SET_DATA_SUCCESS,
  SET_DATA_ERROR
} from './actionTypes';

import { 
  getData,
  getDataSuccess,
  getDataError,
  setData,
  setDataSuccess,
  setDataError
} from './actions';

import { getFirestoreBackend } from '../../helpers/firestore_helper';

const fireStoreBackend = getFirestoreBackend();

function* getDataFunc({ payload }){
  try{
    var collection = payload;
    const response = yield call(fireStoreBackend.getData, collection);
    yield put(getDataSuccess(collection, response));    
  } catch(error){
    yield put(getDataError(error));
  }
}

function* setDataFunc({ payload: {collection, act, data, item}}){
  try{
    if(item){
      const response = yield call(fireStoreBackend.setData, collection, act, item);  
      yield put(setDataSuccess(collection, data))
    }
  } catch(error){
    yield put(setDataError(error));
  }
}

export function* watchGetData(){
  yield takeEvery(GET_DATA, getDataFunc);
}

export function* watchSetData(){
  yield takeEvery(SET_DATA, setDataFunc);
}

function* DataSaga(){
  yield all([
    fork(watchGetData),
    fork(watchSetData)
  ]);
}

export default DataSaga;