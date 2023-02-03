import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContext";

interface PermissionsProps {
  children: React.ReactNode;
  isComponent?: boolean;
  roles: string[];
}

export function Permission({
  children,
  isComponent = false,
  roles,
}: PermissionsProps) {
  const [isAllowed, setIsAllowed] = useState(false);
  const { role } = useContext(AuthContext);

  useEffect(() => {
    // Verify if the user haves the needed roles (permissions) to access data
    if (role) {
      const isPermissionsMatch = roles.every((needRole) =>
        role.permissions.includes(needRole)
      );
      setIsAllowed(isPermissionsMatch);
    }
  }, [role, roles]);

  return (
    <>
      {isAllowed && <>{children}</>}
      {!isAllowed && isComponent && null}
    </>
  );
}
