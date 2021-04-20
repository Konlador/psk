import axios from "axios";
import Qs from "qs";

export default axios.create({
  baseURL: "https://localhost:44394/",
  headers: {
    "Content-type": "application/json",
  },
  paramsSerializer: (params) => Qs.stringify(params, {arrayFormat: 'repeat'})
});
