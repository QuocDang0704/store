import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';

const API_URL_Address = 'http://localhost:8080/api/v1/address';
const API_URL_Voucher = 'http://localhost:8080/api/v1/voucher';
const API_URL_User = 'http://localhost:8080/api/v1/user';

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
