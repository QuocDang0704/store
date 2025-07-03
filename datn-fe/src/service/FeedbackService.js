import axios from 'axios';
import HandleError from '../utils/HandleError';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api/v1/feedbacks';

const FeedbackService = {
  getFeedbacksByProductId: async (id) => {
    try {
      const res = await axios.request({
        method: 'get',
        url: API_URL + '/product/' + id,
      });
      return res.data;
    } catch (error) {
      HandleError.axios(error);
    }
  },
  addFeedback: async (req) => {
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
};

export default FeedbackService; 