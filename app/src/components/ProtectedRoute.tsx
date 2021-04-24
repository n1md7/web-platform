import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import useTokenUpdate from '../hooks/useTokenUpdate';

const ProtectedRoute = (props: any) => {
  const [isAuth, isLoading, errorMessage] = useTokenUpdate();

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  return !isAuth && !isLoading ?
    <Redirect to={{
      pathname: '/sign-in',
      state: {
        from: props.location
      }
    }}/> : <Route {...props}/>;
};

export default ProtectedRoute;
