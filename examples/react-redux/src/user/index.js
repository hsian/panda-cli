import React from 'react';
import ReactDOM from 'react-dom';

import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import thunk from 'redux-thunk';

import rootReducer from './reducers'
import App from "./container/App"

const history = createBrowserHistory();
const store = createStore(
	connectRouter(history)(rootReducer), // 通过redux管理history
	compose(
		applyMiddleware(
	  		routerMiddleware(history), //  if you want to dispatch history actions
		),
		applyMiddleware(thunk)
	),
)

class AppRender extends React.Component{
	render(){
		return(
			<Provider store={store}>
	        	<App history={history} />
	      	</Provider>
		)
	}
}

ReactDOM.render(
	<AppRender/>, 
	document.getElementById('root')
);
