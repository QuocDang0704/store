import { Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthService from '../service/AuthService';

function isElementInArray(arr1, arr2) {
  const lowerCaseArr1 = arr1.map(item => item.toLowerCase());
  const lowerCaseArr2 = arr2.map(item => item.toLowerCase());
  return lowerCaseArr1.some(item => lowerCaseArr2.includes(item));
}


const PrivateRoute = (props) => {
  const { children } = props;
  const [clientId, setCliendId] = useState(AuthService.getClientId());
  const [roles, setRoles] = useState(AuthService.getFunctions());
  useEffect(() => {
    setCliendId(AuthService.getClientId());
    setRoles(AuthService.getFunctions());
  }, [sessionStorage, localStorage]);
  if (clientId && !isElementInArray(roles, props.roles)) {
    return <Navigate replace={true} to='/Unauthorized' />;
  }
  return clientId ? <>{children}</> : <Navigate replace={true} to='/login' />;
};

export default PrivateRoute;
