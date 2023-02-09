import { Permission } from "components/Permission";

export function DashboardView() {
  return (
    <Permission roles={["DASHBOARD"]}>
      <h1>Dashboard</h1>
      <p>não iniciado</p>
    </Permission>
  );
}
