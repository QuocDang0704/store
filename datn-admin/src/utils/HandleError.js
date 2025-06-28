import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import AuthService from '../service/AuthService';

const HandleError = {
  axios: (error) => {
    console.log(error);
    if (error?.response?.status == 203) {
      throw new Error('Non-Authoritative Information');
    } else if (error?.response?.status == 401) {
      throw new Error('Unauthorized');
    } else if (error?.response?.status == 403) {
      throw new Error('Forbidden');
    } else if (
      typeof error?.response?.data == 'string' &&
      error.response.data.length > 0
    ) {
      throw new Error(error.response?.data);
    } else if (
      typeof error?.response?.statusText == 'string' &&
      error.response.statusText.length > 0
    ) {
      throw new Error(error.response?.statusText);
    } else if (typeof error.message == 'string' && error.message.length > 0) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error');
    }
  },
  component: (error, navigate) => {
    toast.error(error && error.message);
    if (
      [
        'Can not refresh access token',
        'Can not get Access Token',
        'Can not get refresh token',
        'Non-Authoritative Information',
        'Unauthorized',
        'Forbidden',
      ].includes(error && error.message)
    ) {
      AuthService.clearLocalToken();
      AuthService.clearSessionToken();
      navigate('/login');
    }
  },
};

export default HandleError;
