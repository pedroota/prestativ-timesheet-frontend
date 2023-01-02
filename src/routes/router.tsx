import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages imports
import { LoginPage } from "pages/LoginPage";
import { Dashboard } from "pages/Dashboard";
import { Timesheet } from "pages/Dashboard/pages/Timesheet";
import { RegisterUser } from "pages/Dashboard/pages/RegisterUser";
import { RegisterClient } from "pages/Dashboard/pages/RegisterClient";
import { RegisterProject } from "pages/Dashboard/pages/RegisterProject";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="register-client" element={<RegisterClient />} />
          <Route path="register-project" element={<RegisterProject />} />
          <Route
            path="register-activity"
            element={<h1>Cadastrar Atividade</h1>}
          />
          <Route path="register-user" element={<RegisterUser />} />
          <Route path="timesheet-admin" element={<h1>Timesheet admin</h1>} />
          <Route path="projects" element={<h1>Projects</h1>} />
          <Route path="consultants" element={<h1>consultants</h1>} />
          <Route path="activities" element={<h1>activities</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
