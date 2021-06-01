import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, loginRequest } from "./authConfig";
import http from './http-common';

const getUuid = require('uuid-by-string')

const getToken = async () => {
  const pca = new PublicClientApplication(msalConfig)
  const accounts = pca.getAllAccounts();

  const account = accounts[0];
  const driveId = getUuid(account.username);
  console.log("Email: ", account.username);
  console.log("DriveId: ", driveId);

  const resp = await pca.acquireTokenSilent({
    ...loginRequest,
    account,
  });
  return [resp.accessToken, driveId];
}

export const callApi = async (method, makeEndpoint, config) => {
  const headers = new Headers();
  const [accessToken, driveId] = await getToken();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-type", "application/json");

  return http.request({
    ...config,
    url: makeEndpoint(driveId),
    method: method,
    headers: headers,
  })
}