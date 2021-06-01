import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.scss";
import store from './Redux/store';
import { Provider } from 'react-redux';
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
