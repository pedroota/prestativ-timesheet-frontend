import { useContext, useEffect } from "react";
import { AuthContext } from "context/AuthContext";

interface PermissionsProps {
  children?: React.ReactNode;
  isComponent?: boolean;
  roles?: string[];
}

export function Permission({ children, isComponent, roles }: PermissionsProps) {
  const { role } = useContext(AuthContext);
  useEffect(() => {
    console.log(role);
  }, [role]);
  return <div>teste</div>;
}
