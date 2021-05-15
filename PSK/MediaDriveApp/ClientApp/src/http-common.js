import axios from "axios";
import Qs from "qs";
import config from "./assets/config.json";


export default axios.create({
    baseURL: config.ApiUrl,
    headers: {
        "Content-type": "application/json",
    },
    paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'repeat' })
});
