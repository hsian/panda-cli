import { combineReducers } from 'redux';
import loginReducer from "./login";
import registerReducer from "./register";
import userReducer from "../../common/reducers/user";

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  user: userReducer
});

export default rootReducer