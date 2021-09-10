import axios, { AxiosInstance } from 'axios';

export const initHttpClient = (baseURL: string): AxiosInstance => axios.create({
  baseURL,
});
