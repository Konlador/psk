import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.scss";
import store from './Redux/store';
import { Provider } from 'react-redux';
import App from "./App";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <App />
      </Provider>
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
