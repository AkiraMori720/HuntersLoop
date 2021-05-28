import {
  GET_DATA,
  GET_DATA_SUCCESS,
  GET_DATA_ERROR,
  SET_DATA,
  SET_DATA_SUCCESS,
  SET_DATA_ERROR
} from './actionTypes';

const INIT_STATE = {
  users: [],
  business: [],
  services: [],
  reviews: [],
  reports: [],  
  memberships: [],
  categories: [],
  loading: false,
  success: false,
  error: ''
};

const Data = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DATA:      
      return {
        ...state,
        loading: true        
      };

    case GET_DATA_SUCCESS:      
      return {
        ...state,
        users: action.payload.collection === 'users' ? action.payload.data : state.users,
        business: action.payload.collection === 'business' ? action.payload.data : state.business,
        services: action.payload.collection === 'services' ? action.payload.data : state.services,
        reviews: action.payload.collection === 'reviews' ? action.payload.data : state.reviews,
        reports: action.payload.collection === 'reports' ? action.payload.data : state.reports,
        memberships: action.payload.collection === 'memberships' ? action.payload.data : state.memberships,
        categories: action.payload.collection === 'categories' ? action.payload.data : state.categories,
        loading: false,        
        error: ''
      };

    case GET_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,        
      };

    case SET_DATA:      
      return {
        ...state,
        loading: true,
        success: false
      };
      
    case SET_DATA_SUCCESS:            
      return {
        ...state,
        users: action.payload.collection === 'users' ? action.payload.data : state.users,
        business: action.payload.collection === 'business' ? action.payload.data : state.business,
        services: action.payload.collection === 'services' ? action.payload.data : state.services,
        reviews: action.payload.collection === 'reviews' ? action.payload.data : state.reviews,
        reports: action.payload.collection === 'reports' ? action.payload.data : state.reports,
        memberships: action.payload.collection === 'memberships' ? action.payload.data : state.memberships,
        categories: action.payload.collection === 'categories' ? action.payload.data : state.categories,
        loading: false,
        success: true,
        error: ''
      };

    case SET_DATA_ERROR:      
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload
      }

    default:
      return state;
  }
};

export default Data