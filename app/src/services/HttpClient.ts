import axios from 'axios';
import {baseURL, headerName} from '../config';
import TokenStore from './TokenStore';

type Config = {
  baseURL: string;
  timeout: number;
  headers: {
    [headerName]?: string;
  },
  validateStatus: (status: number) => boolean
};

const config: Config = {
  baseURL,
  timeout: 5000,
  headers: {},
  validateStatus: function (status: number) {
    return (status >= 200 && status < 300) || [400, 401, 403].includes(status);
  },
};

export let httpClient = axios.create(config);

TokenStore.subscribe(() => {
  if (TokenStore.getState().token) {
    config.headers[headerName] = TokenStore.getState().token as string;
  }
  if (TokenStore.getState().baseUrl) {
    config.baseURL = TokenStore.getState().baseUrl as string;
  }
  httpClient = axios.create(config);
});
