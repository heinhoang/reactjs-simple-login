'use strict';
// Fetch is a new interface for fetching resources like XMLHttpRequest in the past or Superagent with Promises
// It also provides a defnition for concepts such as Cross-Origin Resource Sharing (CORS) and HTTP Origin header semantics.
import fetch from 'isomorphic-fetch'

export const LOGIN_USER = 'LOGIN_USER';

export function login(userData){

  const body = { username: userData.username, 
                 password: userData.password };

  const options = {headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 1234567890' // send an authorization header with a bearer token.
  },
  method: 'post',
  body: JSON.stringify(body)
  }

  // Thunk allows you to write action creators that return a function instead of an action. 
  // The inner function can receive the store methods dispatch and getState as parameters, but we'll just use dispatch
  return dispatch => { // now, `dispatch` is a parameter
    return fetch(`http://reactjsblueprints-useradmin.herokuapp.com/v1/login`, options)
      .then(response => response.json())
    .then(json => dispatch(setLoginDetails(json))) // dispatch tells reducer to take action based on action schema
  }
}
export function setLoginDetails(json){
  // Main action schema
  const loginData = {
    type: LOGIN_USER,
    loginResponse: json,
    timestamp: Date.now()
  };
  // store action schema to session
  sessionStorage.setItem('login',JSON.stringify(loginData));
  return loginData;
}

