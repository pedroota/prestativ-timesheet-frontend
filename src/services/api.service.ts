import Axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const { REACT_APP_API_URL } = process.env;

export const Api: AxiosInstance = Axios.create({
  baseURL: `${REACT_APP_API_URL}`,
  headers: {
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});
