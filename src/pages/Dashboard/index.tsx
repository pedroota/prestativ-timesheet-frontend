import { SidebarAndAppBar } from "components/SidebarAndAppBar";
import { Outlet } from "react-router-dom";

export function Dashboard() {
  return (
    <SidebarAndAppBar>
      <Outlet />
    </SidebarAndAppBar>
  );
}
