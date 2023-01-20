import Axios, { AxiosInstance } from "axios";

const { REACT_APP_API_URL } = process.env;

export const Api: AxiosInstance = Axios.create({
  baseURL: `${REACT_APP_API_URL}`,
});
