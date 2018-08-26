import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import classNames from 'classnames';
import { ContainerQuery } from 'react-container-query';

import GlobalHeader from '../global-header';
import GlobalFooter from '../global-footer';
import SiderMenu from '../sider-menu';

import { getMenuData } from '../../constants/menu';

const logo = "";
const { Content, Header, Footer } = Layout;
//const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData = {}) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;

export default class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
    collapsed: false
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  componentDidMount() {

    const {currentUser} = this.props;

  }
  componentWillUnmount() {
    //unenquireScreen(this.enquireHandler);
  }
  getPageTitle() {
    // const { routerData, location } = this.props;

    // console.log(routerData, location)

    // const { pathname } = location;
    // let title = 'Mee cms';
    // if (routerData[pathname] && routerData[pathname].name) {
    //   title = `${routerData[pathname].name}`;
    // }
    // return title;

    return ""
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return "/";
    }
    return redirect;
  };
  handleMenuCollapse = collapsed => {
    this.setState((nextState) => ({
      collapsed: !nextState.collapsed
    }))
  };

  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      //this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      // this.props.dispatch({
      //   type: 'login/logout',
      // });
    }
  };

  render() {
    const { currentUser, notices, routerData, match, location } = this.props;
    const { collapsed } = this.state;
    const bashRedirect = this.getBashRedirect();

    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            {this.props.children}
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
                {
                  key: 'panda cms website ',
                  title: 'panda cms website',
                  href: '',
                  blankTarget: true,
                },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> some time
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );


    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}


