import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import get from 'lodash/get';
import includes from 'lodash/includes';
import { login } from '../../actions/access.actions';
import toggleLogin from '../../actions/modals.actions';

import ReactModal from 'react-modal';
import { Tooltip } from 'react-tippy'; //find a way to replace the tooltip

import './loginForm.scss';

class LoginForm extends Component {
  props: any
  static propTypes = {
    loginUser: PropTypes.func,
    toggleLogin: PropTypes.func,
    openLogin: PropTypes.bool.isRequired,
    userObj: PropTypes.object,
    error: PropTypes.any,
  };

  static defaultProps = {
    error: null,
    userObj: {},
    loginUser: () => null,
    toggleLogin: () => null,
  };

  state = {
    error: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.userObj && nextProps.userObj.isAuthenticated) {
      this.closeModal();
    }

    if (nextProps.error) {
      this.setState({ error: nextProps.error });
    }
  }

  handleInputChange = (e) => {
    const nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  closeModal = () => {
    this.props.toggleLogin(false);
  };

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.loginUser('oidc');
  };

  onClickModalWindow = () => {
    this.resetError();
  };

  resetError = () => {
    if (this.errorElement && this.errorElement.length > 0) {
      this.setState({ error: null });
    }
  };



  render() {
    const { openLogin } = this.props;
    const { error } = this.state;

    const errorMessage = error ? error.message : '';

    return (
      <ReactModal
        isOpen={openLogin}
        contentLabel="Modal"
        closeTimeoutMS={500}
        onRequestClose={this.closeModal}
      >
        <div onClick={this.onClickModalWindow}>
          <h5>Sign in</h5>
            <form className="loginForm__form d-flex flex-column mx-auto mb-2" onSubmit={this.handleSubmitForm}>
              <span className="loginForm__formHeader my-3 text-center">Sign in with your email</span>
              <div className="form-group">
                <div
                  className={cn('form-group', 'mb-4', {
                    'has-error': includes(get(error, 'type'), 'email'),
                  })}
                >
                  <Tooltip
                    html={<span>{errorMessage}</span>}
                    open={includes(get(error, 'type'), 'email')}
                    onRequestClose={() => this.setState({ error: null })}
                  >
                    <input
                      type="email"
                      className="form-control floatLabel"
                      id="registerInputEmail"
                      required
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocusInput}
                      onBlur={this.handleBlurInput}
                      autoComplete="email"
                      ref={el => (this.email = el)}
                    />
                    <label htmlFor="registerInputEmail">Email</label>
                  </Tooltip>
                </div>
                <div className={cn('form-group', { 'has-error': includes(get(error, 'type'), 'password') })}>
                  <Tooltip
                    html={<span>{errorMessage}</span>}
                    open={includes(get(error, 'type'), 'password')}
                    onRequestClose={() => this.setState({ error: null })}
                  >
                    <input
                      type="password"
                      className="form-control floatLabel mt-2"
                      id="registerInputPassword"
                      required
                      onChange={this.handleInputChange}
                      onFocus={this.handleFocusInput}
                      onBlur={this.handleBlurInput}
                      autoComplete="current-password"
                      ref={el => (this.password = el)}
                    />
                    <label htmlFor="registerInputPassword">Password</label>
                  </Tooltip>
                </div>
              </div>
              <button type="submit" className="btn loginForm__signIn">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </ReactModal>
    );
  }
}

const mapStateToProps = state => ({
  userObj: state.access.user,
  error: state.access.error,
  openLogin: state.toggleModal.login,
});

const mapDispatchToProps = dispatch => ({
  loginUser: (email, password) => dispatch(login(email, password)),
  toggleLogin: newState => dispatch(toggleLogin(newState)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(LoginForm),
);