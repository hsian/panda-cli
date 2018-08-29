import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';

import UserContainer from "../../common/container/UserContainer";
import Login from "./login";
import Register from "./register";

export default class App extends React.Component{
	render(){
		const {history} = this.props;
		return(
			<UserContainer history={history} basename="react-redux-example/portal">
				<Switch>
				  <Route exact path='/' component={Login}/>
				  <Route exact path='/login' component={Login}/>
				  <Route exact path='/register' component={Register}/>
				  <Route component={Login}/>
				</Switch>
			</UserContainer>
		)
	}
}

