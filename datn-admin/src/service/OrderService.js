import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';

const API_URL = 'http://localhost:8080/api/v1/order';

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
  getByStatus: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/getByStatus' + '?' + new URLSearchParams(req),
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
  getTotalAmountByMonth: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/getTotalAmountByMonth' + '?' + new URLSearchParams(req),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getTotalImportAmountByMonth: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/getTotalImportAmountByMonth' + '?' + new URLSearchParams(req),
        headers: {
          Authorization: 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getListYear: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/getListYear',
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
