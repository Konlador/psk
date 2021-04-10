import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.scss";
import store from './app/store';
import { Provider } from 'react-redux';
import App from "./App";
import axios from "axios";
import qs from 'qs';

axios.defaults.baseURL = 'https://localhost:44394/';
axios.defaults.paramsSerializer = (params) => qs.stringify(params, {arrayFormat: 'repeat'})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
