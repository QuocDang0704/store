import axios from 'axios';
import AuthService from './AuthService';
import HandleError from '../utils/HandleError';
import { API_BASE_URL } from '../config/api';

const API_URL = API_BASE_URL + '/supplier';

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
