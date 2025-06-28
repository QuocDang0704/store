import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';

const API_URL = 'http://localhost:8080/api/v1/product';

const ProductService = {
  getProduct: async (req) => {
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
  getProductCustomer: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/customer?' + new URLSearchParams(req),
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getProductById: async (id) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/' + id,
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getProductDetailById: async (id) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/product-details/' + id,
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
};

export default ProductService;
