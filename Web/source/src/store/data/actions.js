import {
  GET_DATA,
  GET_DATA_SUCCESS,
  GET_DATA_ERROR,
  SET_DATA,
  SET_DATA_SUCCESS,
  SET_DATA_ERROR
} from './actionTypes';

export const getData = (collection) => ({
  type: GET_DATA,
  payload: collection
});

export const getDataSuccess = (collection, data) => ({
  type: GET_DATA_SUCCESS,
  payload: { collection, data }
})

export const getDataError = (error) => ({
  type: GET_DATA_ERROR,  
  payload: error
})

export const setData = (collection, act, data, item) => ({
  type: SET_DATA,
  payload: {collection, act, data, item}
});

export const setDataSuccess = (collection, data) => ({
  type: SET_DATA_SUCCESS,
  payload: {collection, data}
})

export const setDataError = (error) => ({
  type: SET_DATA_ERROR,
  payload: error  
})

