import Axios, { AxiosInstance } from "axios";

export const Api: AxiosInstance = Axios.create({
  baseURL: "http://localhost:3001",
});
