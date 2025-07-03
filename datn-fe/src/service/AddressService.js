import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';
import { API_BASE_URL } from '../config/api';

const API_URL_Address = API_BASE_URL + '/address';

const AddressService = {
  getAddress: async () => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL_Address + '/user',
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  createAddress: async (req) => {
    try {
      const res = await axios.request({
        method: 'post',
        url: API_URL_Address + '?',
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
        data: req,
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  delete: async (id) => {
    try {
      const res = await axios.request({
        method: 'delete',
        url: API_URL_Address + '/' + id,
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

export default AddressService;
