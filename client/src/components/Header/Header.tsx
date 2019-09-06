    
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import get from 'lodash/get';
import { logout, getProfile } from '../../actions/access.actions';
import toggleLogin from '../../actions/modals.actions';

class Header extends Component <{}, { value: any }>{
  static propTypes = {
    /* Router */
    location: PropTypes.any.isRequired,
    history: PropTypes.any.isRequired,
    /* Redux */
    userObj: PropTypes.object,
    logoutUser: PropTypes.func,
    getProfile: PropTypes.func,
    toggleLogin: PropTypes.func,
  };

  static defaultProps = {
    userObj: {},
    logoutUser: () => null,
    toggleLogin: () => null,
    getProfile: () => null,
  };

  componentWillReceiveProps(nextProps) {
    if (get(nextProps.location, 'state.loadUser')) {
      this.props.getProfile();
      this.props.history.replace({ state: null });
    }
  }

  handleLoginClick = () => {
    this.props.toggleLogin(true);
  };

  onLogoutClick = () => {
    this.props.logoutUser();
  };

  render() {
    const { userObj } = this.props;
    let userInfoEle = null;
    if (get(userObj, 'isAuthenticated')) {
      let name = get(userObj, 'loggedUserObj.email');
      if (get(userObj, 'loggedUserObj.userName')) {
        name = userObj.loggedUserObj.userName;
      }

      userInfoEle = (
        <div>
          <a>
            {name}
          </a>
          <button className="btn w-100 rounded-0" onClick={this.onLogoutClick}>
            Logout
          </button>
        </div>
      );
    } else {
      userInfoEle = (
        <a onClick={this.handleLoginClick}>Sign&nbsp;in</a>
      );
    }

    return (
      <div>
        <header>
          <nav>
            <div>
              <a>
                Navbar
              </a>
              <div>
                <NavLink>
                  Home
                </NavLink>
                <NavLink>
                  About
                </NavLink>
              </div>
              {userInfoEle}
            </div>
          </nav>
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userObj: state.access.user,
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logout()),
  toggleLogin: newState => dispatch(toggleLogin(newState)),
  getProfile: () => dispatch(getProfile()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Header),
);