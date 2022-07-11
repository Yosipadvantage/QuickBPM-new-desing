import axios from "axios";
import { env } from "../env";


const baseUrl = env.REACT_APP_ENDPOINT;

export default axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
});