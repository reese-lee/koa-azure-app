import React from 'react';
import Loadable from 'react-loadable';

const Loading = () => (
  <div />
);

export const AsyncAboutView = Loadable({
  loader: () => import('./components/About'),
  loading: () => <Loading />,
});

export const AsyncHomeView = Loadable({
  loader: () => import('./components/Home'),
  loading: () => <Loading />,
});