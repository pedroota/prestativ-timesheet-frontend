import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoutes() {
  const isAuthenticated = !!Cookies.get("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
