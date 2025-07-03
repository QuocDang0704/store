import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';
import { API_BASE_URL } from '../config/api';

const API_URL_Address = API_BASE_URL + '/address';
const API_URL_Voucher = API_BASE_URL + '/voucher';
const API_URL_User = API_BASE_URL + '/user';

const UserService = {
  getaddress: async () => {
    try {
      const res = await axios.request({
        method: 'get',
        url:
          API_URL_Address +
          '/user' +
          '?' +
          new URLSearchParams({
            page: 0,
          }),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getVoucher: async () => {
    try {
      const res = await axios.request({
        method: 'get',
        url:
          API_URL_Voucher +
          '?' +
          new URLSearchParams({
            page: 0,
          }),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getUserByUserName: async (userName) => {
    try {
      const res = await axios.request({
        method: 'get',
        url:
          API_URL_User +
          '/findByUserName' +
          '?' +
          new URLSearchParams({
            userName: userName,
          }),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
};

export default UserService;
