import { MenuItem, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { ClientsInfo } from "interfaces/clients.interface";
import { ProjectsInfo } from "interfaces/projects.interface";
import { getClients } from "services/clients.service";
import { useState } from "react";
import { getAllUsers } from "services/auth.service";
import { UserInfo } from "interfaces/users.interface";

export function Filters() {
  const { data: clients } = useQuery(["clients"], () => getClients());
  const { data: users } = useQuery(["users"], () => getAllUsers());
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  return (
    <div style={{ display: "flex", marginBottom: "20px", gap: "8px" }}>
      <h2>Filtros: </h2>
      <TextField
        id="date"
        label="Data"
        type="date"
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        style={{ width: "200px" }}
        select
        label="Cliente"
        name="client"
        onChange={(event) => setSelectedClient(event.target.value)}
      >
        {clients?.data.map(({ code, name, _id }: ClientsInfo) => (
          <MenuItem key={code} value={_id}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        style={{ width: "200px" }}
        select
        label="Projeto"
        name="project"
        onChange={(event) => setSelectedProject(event.target.value)}
      >
        {clients?.data
          .find((client: ClientsInfo) => client._id === selectedClient)
          ?.projects.map(({ _id, title }: ProjectsInfo) => (
            <MenuItem key={_id} value={_id}>
              {title}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        style={{ width: "200px" }}
        select
        label="Atividade"
        name="activity"
      >
        {clients?.data
          .find((client: ClientsInfo) => client._id === selectedClient)
          ?.projects.find(
            (project: ProjectsInfo) => project._id === selectedProject
          )
          ?.activities.map(({ _id, title }: ActivitiesInfo) => (
            <MenuItem key={_id} value={_id}>
              {title}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        style={{ width: "200px" }}
        select
        label="Consultor"
        name="consultant"
      >
        {users?.data.map(({ name, surname, _id }: UserInfo) => (
          <MenuItem key={_id} value={_id}>
            {`${name} ${surname}`}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained">FILTRAR</Button>
      <Button variant="contained">LIMPAR FILTROS</Button>
    </div>
  );
}
