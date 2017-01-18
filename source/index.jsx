'use strict';
import React, { Component, PropTypes } from 'react'
import { Grid, Row, Col, Button, Input } from 'react-bootstrap';
import {render} from 'react-dom';
import store from './stores/store';
import { login, setLoginDetails } from './actions/login'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import DevTools from './devtools';

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount(){
    const { dispatch, } = this.props; // `<Provider store={store}>` bellow will pass `store` to `this.props`. `dispatch` is an parameter of `store`
    let storedSessionLogin = sessionStorage.getItem('login');
    if(storedSessionLogin){ // if action schema was stored in session
      dispatch( // dispatch that schema
        setLoginDetails(JSON.parse(storedSessionLogin).loginResponse)); // but retore that schema to session before dispatch to make sure that it's in the form of our action schema
    }
  }
  handleSelect(){
    const { dispatch, } = this.props;
    dispatch( // dispatches the login action we defned in actions/login.js
      login( 
            {
              username:this.refs.username.getValue(), // get value from input form
              password:this.refs.password.getValue()
            }))
  }

  renderWelcomeMessage(){
    const { user } = this.props
    return (<div>
      {user.message}
      </div>);
  }

  renderInput(){
    return (<div>
      <Input type="text" ref="username" placeholder="username" />
      <br/>
      <Input type="password" placeholder="password" ref="password" />
      <br/>
      <Button onClick={this.handleSelect.bind(this)}>Log in</Button>
    </div>) 
  }

  render () {
    const { user } = this.props;
    return (
      <Grid>
        <DevTools store={store}  />
        <Row > 
          <Col xs={12} md={4}>
            <h3>Please log in...!</h3>
          </Col>
          <Col xs={12}>
            {this.renderInput()}
            </Col>
            <Col xs={12}>
              {this.renderWelcomeMessage()}
              </Col>
            </Row>
          </Grid>
    );
  }
};


// `connect` function bellow will connect `state` in `store` to this app `state`
// This function converts the app state to a set of properties that we can pass to the children components
function mapStateToProps(state) {
  const { user } = state; // get `user` from `store`
  const {
    message
  } = user || {
    message: ""
  }

  return {user}
}

// connects a React component to a Redux store
// Rather than modifying the component in place, it returns a new component class that we can render
const LoginApp = connect(mapStateToProps)(App);

class Root extends Component { // It's recommended that you create a root component wrapping the app inside Provider, unless you want to manually pass the store yourself to all children components
  render() {
    return ( // The Provider component is special because it is responsible for passing the store as a property to the children components
      <Provider store={store}>
        <LoginApp />
      </Provider>
    )
  }
}

render(
  <Root />,
  document.getElementById('app')
);
