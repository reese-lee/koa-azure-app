import React, { Component } from 'react';

import Header from '../Header/Header';
import Routes from '../../routes';
import LoginFormModal from '../LoginForm/LoginForm';

import './App.css';

export class App extends Component {
  state = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;
    return (
      <div>
        <Header />
        <main>
          {!error && <Routes />}
          {error && (
            <div>
              <div role="alert">
                <h4>An error occurred. Please reload the page and try again.</h4>
                <p>
                  {process.env.NODE_ENV === 'development' && errorInfo.componentStack}
                </p>
              </div>
            </div>
          )}
        </main>
        <LoginFormModal />
      </div>
    );
  }
}

export default App;