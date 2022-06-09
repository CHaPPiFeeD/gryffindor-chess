import { endpoints } from './constants';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const API = {

  async login(data: any) {
    return doHttpCall('POST', endpoints.login(), data, {});
  },

  async registration(data: any) {
    return doHttpCall('POST', endpoints.registration(), data, {});
  },

};

export default API;

async function doHttpCall(
  method: string,
  url: string,
  payload: any,
  params: AxiosRequestConfig<any> | undefined,
) {
  try {
    const access_token = localStorage.getItem('access_token');

    const headers: any = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      Accept: 'application/json',
    };

    if (access_token) {
      headers['Authorization'] = `Bearer ${access_token}`;
    }

    let result;

    if (method === 'POST') {
      result = await axios.post(url, payload, { headers, params });
    }

    if (result?.data?.status) {
      return result?.data;
    }
  } catch (err: any) {
    console.log(err.response);
  }
}
