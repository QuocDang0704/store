import axios from 'axios';
import { Buffer } from 'buffer';
import HandleError from '../utils/HandleError';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/v1/auth';
const parseJwt = (token) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

const logout = async () => {
  try {
    clearLocalToken();
    clearSessionToken();
  } catch (error) {
    throw new Error('Can not logout');
  }
};

export const clearLocalToken = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
};

export const clearSessionToken = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
};
const refreshAccessToken = async () => {
  try {
    let isRemember = false;
    let refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      isRemember = true;
    } else {
      refreshToken = sessionStorage.getItem('refresh_token');
    }
    if (isRemember) {
      clearLocalToken();
    } else {
      clearSessionToken();
    }
    if (refreshToken) {
      const res = await axios.request({
        method: 'post',
        url: API_URL + '/refresh-token',
        headers: {
          Authorization: 'Bearer ' + refreshToken,
        },
      });
      const appStorage = isRemember ? localStorage : sessionStorage;
      if (res.data.response && res.data.response.jwtToken) {
        appStorage.setItem('access_token', res.data.response?.jwtToken);
        appStorage.setItem('refresh_token', res.data.response?.refreshToken);
        return res.data.access_token;
      }
      throw new Error('Can not refresh access token');
    }
    throw new Error('Can not get refresh token');
  } catch (error) {
    clearLocalToken();
    clearSessionToken();
    throw new Error('Can not refresh access token');
  }
};

const AuthService = {
  clearLocalToken,
  clearSessionToken,
  login: async ({ username, password, isRemember }) => {
    try {
      const res = await axios.request({
        method: 'post',
        url: API_URL + '/login',
        data: {
          username: username,
          password: password,
        },
      });
      const appStorage = isRemember ? localStorage : sessionStorage;
      if (res.data.response && res.data.response.jwtToken) {
        appStorage.setItem('access_token', res.data.response?.jwtToken);
        appStorage.setItem('refresh_token', res.data.response?.refreshToken);
      }
      return res.data;
    } catch (error) {
      if (error.message.includes('403')) {
        throw new Error('Wrong username or password');
      } else {
        HandleError.axios(error);
      }
    }
  },
  register: async (req) => {
    try {
      const res = await axios.request({
        method: 'post',
        url: API_URL + '/register',
        data: req,
        // headers: {
        //   Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        // },
      });

      return res.data;
    } catch (error) {
      if (error.message.includes('403')) {
        throw new Error('Wrong username or password');
      } else {
        HandleError.axios(error);
      }
    }
  },
  getClientId: () => {
    const refreshToken =
      localStorage.getItem('refresh_token') ??
      sessionStorage.getItem('refresh_token');
    if (refreshToken) {
      const decodeToken = parseJwt(refreshToken);
      if (decodeToken && decodeToken.sub) {
        return decodeToken.sub;
      }
    }
    return '';
  },
  getRoles: () => {
    const accessToken =
      localStorage.getItem('access_token') ??
      sessionStorage.getItem('access_token');
    if (accessToken) {
      const decodeToken = parseJwt(accessToken);
      if (decodeToken && decodeToken.role) {
        return decodeToken.role;
      }
    }
    return [];
  },
  getFunctions: () => {
    const accessToken =
      localStorage.getItem('access_token') ??
      sessionStorage.getItem('access_token');
    if (accessToken) {
      const decodeToken = parseJwt(accessToken);
      if (decodeToken && decodeToken.function) {
        return decodeToken.function;
      }
    }
    return [];
  },
  getCurrentUser: () => {
    const accessToken =
      localStorage.getItem('access_token') ??
      sessionStorage.getItem('access_token');
    if (accessToken) {
      const decodeToken = parseJwt(accessToken);
      if (decodeToken) {
        return decodeToken;
      }
    }
    return [];
  },
  logout,
  getAccessToken: async () => {
    const accessToken =
      localStorage.getItem('access_token') ??
      sessionStorage.getItem('access_token');
    if (accessToken) {
      const decodeToken = parseJwt(accessToken);
      if (decodeToken && decodeToken.exp) {
        const currentTime = Date.now();
        const expireAt = Number(decodeToken.exp) * 1000;
        if (expireAt < currentTime) {
          console.log('Token expire', expireAt, currentTime);
          return await refreshAccessToken();
        } else {
          return accessToken;
        }
      } else {
        return accessToken;
      }
    } else {
      throw new Error('Can not get Access Token');
    }
  },
};

export default AuthService;
