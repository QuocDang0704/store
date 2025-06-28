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
        url: API_URL + '/customer' + '?' + new URLSearchParams(req),
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
  create: async (productData) => {
    try {

      const res = await axios.request({
        method: 'post',
        url: API_URL,
        data: productData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + (await AuthService.getAccessToken()),
        }
      });

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  update: async (productData) => {
    try {

      const res = await axios.request({
        method: 'put',
        url: API_URL,
        data: productData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + (await AuthService.getAccessToken()),
        }
      });

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  delete: async (id) => {
    try {
      const res = await axios.request({
        method: 'delete',
        url: API_URL + '/' + id,
        headers: {
          'Authorization': 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },

  createDetail: async (productDetail) => {
    try {

      const res = await axios.request({
        method: 'post',
        url: API_URL + '/product-details',
        data: productDetail,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + (await AuthService.getAccessToken()),
        }
      });

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  updateDetail: async (productDetail) => {
    try {

      const res = await axios.request({
        method: 'put',
        url: API_URL + '/product-details',
        data: productDetail,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + (await AuthService.getAccessToken()),
        }
      });

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  deleteProductDetail: async (id) => {
    try {
      const res = await axios.request({
        method: 'delete',
        url: API_URL + '/product-details' + '/' + id,
        headers: {
          'Authorization': 'Bearer ' + (await AuthService.getAccessToken()),
        },
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  getProductDetail: async (req) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/product-details?' + new URLSearchParams(req),
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

export default ProductService;
