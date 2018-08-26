import React, { Component } from 'react';
import styles from './index.less';
import BasicLayout from "../../../common/components/base-layout";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  dispatch
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {
  render() {
  	const {user} =this.props;
    return (
    	<BasicLayout currentUser={user}>
        user list
      </BasicLayout>
    );
  }
}


