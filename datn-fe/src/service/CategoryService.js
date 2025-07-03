import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';
import { API_BASE_URL } from '../config/api';

const API_URL = API_BASE_URL + '/category';

const CategoryService = {
  getAll: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '?' + new URLSearchParams(req),
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  create: async (req) => {
    try {
      const res = await axios.request({
        method: 'post',
        url: API_URL,
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
  update: async (req) => {
    try {
      const res = await axios.request({
        method: 'post',
        url: API_URL,
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
        url: API_URL + '/' + id,
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

export default CategoryService;
