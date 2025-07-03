import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';
import { API_BASE_URL } from '../config/api';

const API_URL = API_BASE_URL + '/order';

const OrderService = {
  createOrder: async (req) => {
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
  getAllOrdersByStatus: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/getByCurrentUser?' + new URLSearchParams(req),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  updateOrderStatusById: async (id, status) => {
    try {
      const res = await axios.request({
        method: 'put',
        url:
          API_URL + '/update-status/' + id + '?' + new URLSearchParams(status),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getById: async (id) => {
    try {
      const res = await axios.request({
        method: 'get',
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

export default OrderService;
