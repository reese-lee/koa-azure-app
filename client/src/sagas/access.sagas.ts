import { put, call, takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../constants/actionTypes';
import lGet from 'lodash/get';
import passport from 'passport';

function* login() {
  try {
    const response = yield call(
      passport.authenticate('oidc'),
      '/login',
    );
    yield put({ type: ActionTypes.LOGIN_SUCCEEDED, user: response.data });
  } catch (error) {
    if (lGet(error.response, 'data')) {
      yield put({ type: ActionTypes.LOGIN_FAILED, error: error.response.data });
    } else {
      yield put({ type: ActionTypes.LOGIN_FAILED, error });
    }
  }
}

export function* watchLogin() {
  yield takeLatest(ActionTypes.LOGIN_REQUESTED, login);
}

function* logout(cxt) {
  try {
    yield call(
      cxt.logout(),
      '/logout',
    );
    cxt.session.destroy()
    yield put({ type: ActionTypes.LOGOUT_SUCCEEDED });
  } catch (error) {
    if (lGet(error.response, 'data')) {
      yield put({ type: ActionTypes.LOGOUT_FAILED, error: error.response.data });
    } else {
      yield put({ type: ActionTypes.LOGOUT_FAILED, error: error.response });
    }
  }
}

export function* watchLogout() {
  yield takeLatest(ActionTypes.LOGOUT_REQUESTED, logout);
}

function* getProfile(cxt) {
  try {
    const response = yield call(
      cxt.user,
      '/users/profile',
    );
    yield put({ type: ActionTypes.PROFILE_SUCCEEDED, user: response });
  } catch (error) {
    yield put({ type: ActionTypes.PROFILE_FAILED, error: error.response });
  }
}

export function* watchGetProfile() {
  yield takeLatest(ActionTypes.PROFILE_REQUESTED, getProfile);
}