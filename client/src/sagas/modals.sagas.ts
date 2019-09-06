import { put, takeLatest } from 'redux-saga/effects';
import * as ActionTypes from '../constants/actionTypes';
import passport from 'passport';

function* toggleModal() {
  const { newState } = passport.authenticate('oidc');
  if (!newState) {
    yield put({ type: ActionTypes.LOGIN_FAILED, error: null });
  }
  yield put({ type: ActionTypes.TOGGLE_MODAL_SUCCEEDED, newState });
}

export default function* watchToggleModal() {
  yield takeLatest(ActionTypes.TOGGLE_MODAL_REQUESTED, toggleModal);
}