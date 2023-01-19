import { Outlet, Navigate } from "react-router-dom";

interface PermissionsProps {
  isAllowed: boolean;
  redirectPath: string;
}

export function Permissions({ isAllowed, redirectPath }: PermissionsProps) {
  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} />;
}
