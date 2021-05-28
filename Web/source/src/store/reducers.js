import { combineReducers } from "redux";

import Auth from "./auth/reducer";
import Data from "./data/reducer";

const rootReducer = combineReducers({  
  auth: Auth,
  data: Data
});

export default rootReducer;
