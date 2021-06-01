import axios from "axios";
import Qs from "qs";

export default axios.create({
  baseURL: "https://localhost:44344/",
  headers: {
    "Content-type": "application/json",
  },
  paramsSerializer: (params) => Qs.stringify(params, {arrayFormat: 'repeat'})
});
