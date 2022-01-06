import axios, { AxiosInstance } from 'axios';

export const initHttpClient = (baseURL: string, getAuthorizationHeader: () => string | undefined): AxiosInstance => {
  const httpClient = axios.create({ baseURL });

  httpClient.defaults.headers = {
    Authorization: getAuthorizationHeader() ?? '',
    'Content-Type': 'application/json',
  };

  return httpClient;
};
