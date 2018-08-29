import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Authority from "./utils/authority";
import permission from "./utils/promission";

// https://github.com/supasate/connected-react-router#step-2
import { ConnectedRouter } from 'connected-react-router';

const mapStateToProps = state => ({
  user: state.user,
  login: state.login
})

const mapDispatchToProps = dispatch => ({
  dispatch
})

@connect(mapStateToProps, mapDispatchToProps)
export default class AppContainer extends React.Component{

	checkPermissions = () => {
		const {user} = this.props;

		console.log(user)

		// 是否是注冊的会员
		return permission.hasPermiss(user, permission.MEMBER);
	}

	componentWillReceiveProps(){
		const {login} = this.props;
		console.log(this.props.login)
		if(login.status === "success"&& this.checkPermissions){
			window.location.replace("main")
		}
	}

	render(){
		const {children, history, basename} = this.props;

		return(
			<ConnectedRouter history={history}>
				<BrowserRouter basename={basename}>
					{children}
				</BrowserRouter>
			</ConnectedRouter>
		)
	}
}