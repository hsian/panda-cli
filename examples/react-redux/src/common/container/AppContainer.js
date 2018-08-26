import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {Spin, Row} from "antd";
import Authority from "./utils/authority";
import permission from "./utils/promission";
import { setUserAction } from "../actions/user";

// https://github.com/supasate/connected-react-router#step-2
import { ConnectedRouter, push } from 'connected-react-router';

const mapStateToProps = state => ({
	user: state.user // 通过app的reducer搬到的
})

const mapDispatchToProps = dispatch => ({
	setUser: (data) => dispatch(setUserAction(data)),
	dispatch
})

@connect(mapStateToProps, mapDispatchToProps)
export default class AppContainer extends React.Component{

	state = {
		isPromise: false
	}

	checkPermissions = (user) => {
		//const {user} = this.props;
		// 是否是注冊的会员
		const isPromise = permission.hasPermiss(user, permission.MEMBER);
		this.setState(() => ({
			isPromise
		}))
		return isPromise;
	}

	componentDidMount(){
		const {setUser} =  this.props;

		fetch("http://127.0.0.1:3000/user").then(res => {
			return res.json()
		}).then(data => {
			setUser({
	        	username: data.username,
	        	role: data.role
	        });

	        if(!this.checkPermissions(data)){
				const {history, dispatch} = this.props;
				dispatch(push("portal"))
				window.location.replace("portal")
			}
		})

		
	}

	render(){
		const {children, history} = this.props;	
		const {isPromise} = this.state;
		const Loading = () => (
			<Row type="flex" 
				justify="center" 
				align="middle"
				style={{
					position: "absolute", 
					top:0, 
					bottom:0,
					width: "100%",
					background:"rgba(0,0,0, 0.5)",
					zIndex: 99
				}}
			>
				<Spin tip="正常验证登录"/>
			</Row>
		)

		return(
			<div>
				{!isPromise && <Loading/>}
				<ConnectedRouter history={history}>
					<HashRouter>
						{children}
					</HashRouter>
				</ConnectedRouter>
			</div>
		)
	}
}