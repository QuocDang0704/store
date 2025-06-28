import axios from 'axios';
import { toast } from 'react-toastify';

let API_URL = 'http://localhost:8080'; // Thay đổi API_URL thành địa chỉ API của bạn

const instance = axios.create({
  baseURL: API_URL,
  timeout: 50000,
});
// Thêm interceptor để tự động thêm token vào header của mỗi request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Lấy token từ local storage hoặc từ nơi khác

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Thêm header Authorization với giá trị "Bearer <token>"
    }

    return config;
  },
  (error) => Promise.reject(error),
);
const get = async (url) => {
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const post = async (url, data) => {
  try {
    const response = await instance.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const put = async (url, data) => {
  try {
    const response = await instance.put(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const remove = async (url) => {
  try {
    const response = await instance.delete(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// const get = async (url) => {
//   try {
//     const response = await axios.get(`${API_URL}/${url}`);
//     return response.data;
//   } catch (error) {
//     // toast.error(error.response.data.message);
//     console.error(error);
//   }
// };

// const post = async (url, data) => {
//   try {
//     const response = await axios.post(`${API_URL}/${url}`, data);
//     return response.data;
//   } catch (error) {
//     toast.error(error.response.data.message);
//     console.error(error);
//   }
// };

// const put = async (url, data) => {
//   try {
//     const response = await axios.put(`${API_URL}/${url}`, data);
//     return response.data;
//   } catch (error) {
//     toast.error(error.response.data.message);
//     console.error(error);
//   }
// };

// const remove = async (url) => {
//   try {
//     const response = await axios.delete(`${API_URL}/${url}`);
//     return response.data;
//   } catch (error) {
//     toast.error(error.response.data.message);
//     console.error(error);
//   }
// };

export default {
  get,
  post,
  put,
  remove,
};
