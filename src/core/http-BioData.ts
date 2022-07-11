import axios from "axios";
const baseUrl = 'http://localhost:3377';

export default axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-type': 'application/x-www-form-urlencoded'
    }
});