import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44394/",
  headers: {
    "Content-type": "application/json",
  },
});
