import { Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthService from '../service/AuthService';

function isElementInArray(arr1, arr2) {
  return arr1.some((item) => arr2.includes(item));
}

const PrivateRoute = (props) => {
  const { children } = props;
  const [clientId, setCliendId] = useState(AuthService.getClientId());
  const [roles, setRoles] = useState(AuthService.getRoles());
  useEffect(() => {
    setCliendId(AuthService.getClientId());
    setRoles(AuthService.getRoles());
  }, [sessionStorage, localStorage]);
  if (clientId && !isElementInArray(roles, props.roles)) {
    return <Navigate replace={true} to='/' />;
  }
  return clientId ? <>{children}</> : <Navigate replace={true} to='/login' />;
};

export default PrivateRoute;
