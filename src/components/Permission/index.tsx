import { useEffect, useState } from "react";
import { useAuthStore } from "stores/userStore";

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
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Verify if the user haves the needed roles (permissions) to access data
    if (user.role) {
      const isPermissionsMatch = roles.every((needRole) =>
        user.role.permissions.includes(needRole)
      );
      setIsAllowed(isPermissionsMatch);
    }
  }, [user.role, roles]);

  return (
    <>
      {isAllowed && <>{children}</>}
      {!isAllowed && isComponent && null}
    </>
  );
}
