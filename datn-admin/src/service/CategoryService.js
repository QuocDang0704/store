import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';

const API_URL = 'http://localhost:8080/api/v1/category';

const CategoryService = {
  checkProductExistByCategory: async (id) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/checkProductExistByCategory/' + id,
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getAll: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '?' + new URLSearchParams(req),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
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
