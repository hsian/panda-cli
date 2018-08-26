import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Checkbox, Alert, Icon, Row } from 'antd';
import { connect } from 'react-redux'
import { setUserAction } from "../../../common/actions/user"
import { loginChangeAction, loginAsyncAction } from '../../actions/login'
import Login from '../../../common/components/login';
import styles from './index.less';
import { push } from 'connected-react-router';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

const mapStateToProps = state => ({
  login: state.login,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  loginChange: (data) => dispatch(loginChangeAction(data)),
  loginAsync: (data) => dispatch(loginAsyncAction(data)),
  setUser: (data) => dispatch(setUserAction(data)),
  dispatch
})


@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  // 可设置多个tab
  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const {login, setUser, dispatch, loginChange, loginAsync, history, location} = this.props;
    const { type } = this.state;
    if(!err) { 

      fetch('http://127.0.0.1:3000/login',{
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "role": "administrator",
          "statusCode": 200,
          ...values
        })
      }).then(res => {
        return res.json()
      }).then(data => {
        console.log(data)

        loginChange({
          status: "success"
        });
        setUser({
          username: data.username,
          role: data.role
        });
      })

      // json-server 在action发起异步请求不能设置数据， 奇葩
      // loginAsync(values).then(data => {
        
      //   // 保存用户数据
      //   setUser({
      //     username: data.username,
      //     role: data.role
      //   });
      // });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;

    return (
    	<Row type="flex" align="middle" justify="center" className={styles.wrapper}>
	      <div className={styles.main}>
	        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
	          <Tab key="account" tab="账户密码登录">
	            {login.status === 'error' &&
	              !login.submitting &&
	              this.renderMessage('账户或密码错误')}
	              <UserName name="username" placeholder="" />
	              <Password name="password" placeholder="" />
	          </Tab>
	          <div>
	            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
	              自动登录
	            </Checkbox>
	            <Link style={{ float: 'right', marginLeft: 10 }} to="/register">
	              立即注册
	            </Link>
	            <a style={{ float: 'right' }} href="">
	              忘记密码? 
	            </a>
	          </div>
	          <Submit loading={submitting}>登录</Submit>
	        </Login>
	      </div>
      </Row>
    );
  }
}


