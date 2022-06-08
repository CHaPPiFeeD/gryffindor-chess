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
    let result;

    if (method === 'POST') {
      result = await axios.post(url, payload, params);
    }

    if (result?.data?.status) {
      return result?.data;
    }
  } catch (err: any) {
    console.log(err.response);
  }
}
