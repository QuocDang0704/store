import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';

const API_URL = 'http://localhost:8080/api/v1/supplier';

const SupplierService = {
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
};

export default SupplierService;
