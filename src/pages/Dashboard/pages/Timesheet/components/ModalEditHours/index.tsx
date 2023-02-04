import { useState, Dispatch, SetStateAction } from "react";
import {
  Dialog,
  Box,
  TextField,
  Typography,
  MenuItem,
  FormLabel,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ClientsInfo } from "interfaces/clients.interface";
import { ProjectsInfo } from "interfaces/projects.interface";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "services/clients.service";
import { getHoursById } from "services/hours.service";
import { Permission } from "components/Permission";

interface ModalEditHoursProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentHour: string;
}

export function ModalEditHours({
  isOpen,
  setIsOpen,
  currentHour,
}: ModalEditHoursProps) {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useQuery(["hours", currentHour], () => getHoursById(currentHour), {
    onSuccess(data) {
      reset(data.data?.hours);
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  // Requests inputs
  const { data: clients } = useQuery(["clients"], () => getClients());

  return (
    <Permission roles={["EDITAR_HORAS"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4, minWidth: 420 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar horas</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Data
                <TextField
                  type="date"
                  color="warning"
                  variant="outlined"
                  required
                  {...register("initialDate")}
                />
              </FormLabel>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Ajuste
                <TextField
                  type="time"
                  color="warning"
                  variant="outlined"
                  required
                  {...register("adjustment")}
                />
              </FormLabel>
            </Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Hora inicial
                <TextField
                  type="time"
                  color="warning"
                  variant="outlined"
                  required
                  {...register("initialHour")}
                />
              </FormLabel>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Hora final
                <TextField
                  type="time"
                  color="warning"
                  variant="outlined"
                  required
                  {...register("finalHour")}
                />
              </FormLabel>
            </Box>

            <Box sx={{ display: "flex", gap: "1rem" }}>
              <TextField
                required
                color="warning"
                variant="outlined"
                label="Cliente"
                select
                defaultValue=""
                InputLabelProps={{ shrink: true }}
                sx={{ width: "100%" }}
                {...register("relClient")}
                onChange={(event) => setSelectedClient(event.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione uma opção
                </MenuItem>
                {clients?.data.map(({ name, _id }: ClientsInfo) => (
                  <MenuItem key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                color="warning"
                variant="outlined"
                label="Projeto"
                InputLabelProps={{ shrink: true }}
                select
                defaultValue=""
                sx={{ width: "100%" }}
                {...register("relProject")}
                onChange={(event) => setSelectedProject(event.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione uma opção
                </MenuItem>
                {clients?.data
                  .find((client: ClientsInfo) => client._id === selectedClient)
                  ?.projects.map(({ _id, title }: ProjectsInfo) => (
                    <MenuItem key={_id} value={_id}>
                      {title}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            <TextField
              required
              color="warning"
              variant="outlined"
              label="Atividade"
              InputLabelProps={{ shrink: true }}
              defaultValue=""
              select
              {...register("relActivity")}
            >
              <MenuItem value="" disabled>
                Selecione uma opção
              </MenuItem>
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
              required
              color="warning"
              multiline
              rows={4}
              variant="outlined"
              label="Descrição da Atividade"
              InputLabelProps={{ shrink: true }}
              {...register("activityDesc")}
            />
            <TextField
              required
              color="warning"
              multiline
              rows={4}
              variant="outlined"
              label="Chamado Lançado"
              InputLabelProps={{ shrink: true }}
              {...register("releasedCall")}
            />
            <Button
              variant="contained"
              color="warning"
              type="submit"
              sx={{ paddingBlock: "1rem" }}
            >
              Concluído
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}
