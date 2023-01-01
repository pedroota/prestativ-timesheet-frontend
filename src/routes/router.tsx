import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages imports
import { LoginPage } from "pages/LoginPage";
import { Dashboard } from "pages/Dashboard";
import { Timesheet } from "pages/Dashboard/pages/Timesheet";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="register-client" element={<h1>Cadastrar Cliente</h1>} />
          <Route path="register-project" element={<h1>Cadastrar Projeto</h1>} />
          <Route
            path="register-activity"
            element={<h1>Cadastrar Atividade</h1>}
          />
          <Route path="register-user" element={<h1>Cadastrar User</h1>} />
          <Route path="timesheet-admin" element={<h1>Timesheet admin</h1>} />
          <Route path="projects" element={<h1>Projects</h1>} />
          <Route path="consultants" element={<h1>consultants</h1>} />
          <Route path="activities" element={<h1>activities</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
