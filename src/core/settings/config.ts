import { AxiosRequestConfig } from 'axios';
import { env } from "../../env";

const baseUrl = env.REACT_APP_ENDPOINT;
const baseUrlBioData = 'http://localhost:3377';

export const axiosRequestConfiguration: AxiosRequestConfig = {
  baseURL: baseUrl,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
};
export const axiosRequestConfiguration2: AxiosRequestConfig = {
  baseURL: baseUrlBioData,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
}