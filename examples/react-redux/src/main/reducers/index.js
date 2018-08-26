import { combineReducers } from 'redux';
import userReducer from "../../common/reducers/user";

const rootReducer = combineReducers({
  user: userReducer
});

export default rootReducer