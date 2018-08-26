import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';

import AppContainer from "../../common/container/AppContainer";
import Index from "./index";

export default class App extends React.Component{
	render(){
		const {history} = this.props;
		return(
			<AppContainer history={history}>
				<Switch>
				  <Route exact path='/' component={Index}/>
				  <Route component={Index}/>
				</Switch>
			</AppContainer>
		)
	}
}

