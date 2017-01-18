import {
  LOGIN_USER
} from '../actions/login';
import { combineReducers } from 'redux'

// a reducer named user with initial state and action. It will trigger via dispatch function
function user(state = {
  message: "",
  userData: {}
}, action){

  switch(action.type){
    case LOGIN_USER:
      let message;
        message=action.loginResponse.message ?
        action.loginResponse.message :
        action.loginResponse.length ? 
      "Welcome "+action.loginResponse.map((item,idx)=>{ // return an array like `{'', '', username, ...}`
      return item.name
      }).reduce((name)=>{return name}) // return username
      : "Invalid login";
      return {
        message: message,
        timestamp: action.timestamp
      }

      default:
        return state
  }
}

const rootReducer = combineReducers({user});

export default rootReducer

