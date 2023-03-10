import { Box, MenuItem, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { ClientsInfo } from "interfaces/clients.interface";
import { ProjectsInfo } from "interfaces/projects.interface";
import { getClients } from "services/clients.service";
import { useState } from "react";
import { getAllUsers, getUserById } from "services/auth.service";
import { UserInfo } from "interfaces/users.interface";
import { useAuthStore } from "stores/userStore";

interface FiltersProps {
  receiveDataURI: (encondeURIParams: string) => void;
}

interface ActivityModalReturnProps {
  _id: string;
  title: string;
  activityValidity: number;
}

export function Filters({ receiveDataURI }: FiltersProps) {
  const user = useAuthStore((state) => state.user);
  const { data: clients } = useQuery(["clients"], () => getClients());
  const { data: users } = useQuery(["users"], () => getAllUsers());
  const { data: thisUser } = useQuery(["users", user._id], () =>
    getUserById(user._id)
  );
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [selectedInitialDate, setSelectedInitialDate] = useState("");
  const [selectedFinalDate, setSelectedFinalDate] = useState("");
  const validateUser = () => {
    if (user.typeField == "nenhum") {
      return true;
    }
    return false;
  };

  return (
    <Box
      className="mobile"
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "20px",
        gap: "8px",
      }}
    >
      <h2>Filtros: </h2>
      <TextField
        id="date"
        label="Data Inicial"
        type="date"
        color="warning"
        value={selectedInitialDate}
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) => setSelectedInitialDate(event.target.value)}
      />
      <TextField
        id="date"
        label="Data Final"
        type="date"
        color="warning"
        value={selectedFinalDate}
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) => setSelectedFinalDate(event.target.value)}
      />
      {validateUser() ? (
        <>
          <TextField
            style={{ width: "200px" }}
            select
            color="warning"
            value={selectedClient}
            label="Cliente"
            name="client"
            onChange={(event) => setSelectedClient(event.target.value)}
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
            {clients?.data.map(({ name, _id }: ClientsInfo) => (
              <MenuItem key={_id} value={_id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            style={{ width: "200px" }}
            select
            value={selectedProject}
            label="Projeto"
            color="warning"
            name="project"
            onChange={(event) => setSelectedProject(event.target.value)}
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
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
            color="warning"
            value={selectedActivity}
            label="Atividade"
            name="activity"
            onChange={(event) => setSelectedActivity(event.target.value)}
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
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
        </>
      ) : (
        <TextField
          style={{ width: "200px" }}
          select
          color="warning"
          value={selectedActivity}
          label="Atividade"
          name="activity"
          onChange={(event) => setSelectedActivity(event.target.value)}
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {thisUser?.data?.user?.activities.map(
            (activity: ActivityModalReturnProps) => (
              <MenuItem value={activity._id} key={activity._id}>
                {activity.title}
              </MenuItem>
            )
          )}
        </TextField>
      )}

      {validateUser() ? (
        <TextField
          style={{ width: "200px" }}
          select
          color="warning"
          value={selectedConsultant}
          label="Consultor"
          name="consultant"
          onChange={(event) => setSelectedConsultant(event.target.value)}
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {users?.data.map(({ name, surname, _id }: UserInfo) => (
            <MenuItem key={_id} value={_id}>
              {`${name} ${surname}`}
            </MenuItem>
          ))}
        </TextField>
      ) : null}

      <Button
        color="warning"
        variant="contained"
        onClick={() => {
          const array = [
            selectedInitialDate ? `dataI=${selectedInitialDate}` : "",
            selectedFinalDate ? `dataF=${selectedFinalDate}` : "",
            selectedClient ? `relClient=${selectedClient}` : "",
            selectedProject ? `relProject=${selectedProject}` : "",
            selectedActivity ? `relActivity=${selectedActivity}` : "",
            selectedConsultant ? `relUser=${selectedConsultant}` : "",
          ];
          const validArray = array.filter((i) => i.trim().length > 0);
          const params = validArray.map(encodeURIComponent).join("&");
          receiveDataURI(params);
        }}
      >
        FILTRAR
      </Button>
      <Button
        color="warning"
        variant="contained"
        onClick={() => {
          setSelectedInitialDate("");
          setSelectedFinalDate("");
          setSelectedActivity("");
          setSelectedProject("");
          setSelectedClient("");
          setSelectedConsultant("");
          receiveDataURI("");
        }}
      >
        LIMPAR FILTROS
      </Button>
    </Box>
  );
}
