import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes";
import { Permissions } from "./Permissions";

// Pages imports
import { LoginPage } from "pages/LoginPage";
import { Dashboard } from "pages/Dashboard";
import { TimesheetAdmin } from "pages/Dashboard/pages/TimesheetAdmin";
import { TimesheetConsultant } from "pages/Dashboard/pages/TimesheetConsultant";
import { TimesheetProjectManager } from "pages/Dashboard/pages/TimesheetProjectManager";
import { TimesheetOperational } from "pages/Dashboard/pages/TimesheetOperational";
import { RegisterUser } from "pages/Dashboard/pages/RegisterUser";
import { RegisterClient } from "pages/Dashboard/pages/RegisterClient";
import { RegisterProject } from "pages/Dashboard/pages/RegisterProject";
import { RegisterActivity } from "pages/Dashboard/pages/RegisterActivity";
import { ListClients } from "pages/Dashboard/pages/ListClients";
import { ListProjects } from "pages/Dashboard/pages/ListProjects";
import { ListActivities } from "pages/Dashboard/pages/ListActivities";
import { ListUsers } from "pages/Dashboard/pages/ListUsers";
import { ForgotPassword } from "pages/ForgotPassword";
import { NewPassword } from "pages/NewPassword";
import { ListLogs } from "pages/Dashboard/pages/ListLogs";

// Context
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

export function Router() {
  const { role } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgotpass" element={<ForgotPassword />} />
        <Route path="/newpass" element={<NewPassword />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route
              element={
                <Permissions
                  isAllowed={role !== "Consultor"}
                  redirectPath="dashboard"
                />
              }
            >
              <Route path="register-client" element={<RegisterClient />} />
              <Route path="timesheetAdmin" element={<TimesheetAdmin />} />
              <Route
                path="timesheetConsultant"
                element={<TimesheetConsultant />}
              />
              <Route
                path="timesheetProjectManager"
                element={<TimesheetProjectManager />}
              />
              <Route
                path="timesheetOperational"
                element={<TimesheetOperational />}
              />
              <Route path="register-project" element={<RegisterProject />} />
              <Route path="register-activity" element={<RegisterActivity />} />
              <Route path="register-user" element={<RegisterUser />} />
              <Route path="clients" element={<ListClients />} />
              <Route path="projects" element={<ListProjects />} />
              <Route path="activities" element={<ListActivities />} />
              <Route path="users" element={<ListUsers />} />
              <Route path="logs" element={<ListLogs />} />
            </Route>

            <Route
              element={
                <Permissions
                  isAllowed={role !== "Operacional"}
                  redirectPath="register-client"
                />
              }
            ></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
