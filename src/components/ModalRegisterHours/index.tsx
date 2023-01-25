import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Close } from "@mui/icons-material";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  FormLabel,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { generateTimestampWithDateAndTime } from "utils/timeControl";
import { RegisterHours } from "interfaces/hours.interface";
import { createHours } from "services/hours.service";
import { useContext, useState } from "react";
import { AuthContext } from "context/AuthContext";
import { decodeJwt } from "utils/decodeJwt";
import { getClients } from "services/clients.service";
import { ClientsInfo } from "interfaces/clients.interface";
import { ProjectsInfo } from "interfaces/projects.interface";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { toast } from "react-toastify";
interface ModalRegisterHoursProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalRegisterHours({
  isOpen,
  setIsOpen,
}: ModalRegisterHoursProps) {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { mutate } = useMutation(
    ({
      initial,
      final,
      adjustment,
      relClient,
      relProject,
      relActivity,
      relUser,
      activityDesc,
    }: RegisterHours) =>
      createHours({
        initial,
        final,
        adjustment,
        relClient,
        relProject,
        relActivity,
        relUser,
        activityDesc,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hours"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );

  const onSubmit = handleSubmit(
    ({
      initialDate,
      initialHour,
      finalHour,
      relClient,
      relProject,
      relActivity,
      activityDesc,
    }) => {
      const initial = generateTimestampWithDateAndTime(
        initialDate,
        initialHour
      );
      const final = generateTimestampWithDateAndTime(initialDate, finalHour);
      const maxDaysCanRelease = 4; // Periodo máximo para lançar horas - editando essa variável, o sistema irá permitir que datas mais antigas sejam possiveis lançar
      const daysInMiliseconds = maxDaysCanRelease * 1000 * 60 * 60 * 24;
      const today = Date.now();
      const adjustment = 0; // Presets the adjusment property to 0, just ADMs can change it
      const { id } = decodeJwt(`${user}`);
      if (initial > today + daysInMiliseconds / maxDaysCanRelease) {
        toast.error("A data informada ainda não está disponível para lançar");
        return;
      }
      if (initial < today - daysInMiliseconds) {
        toast.error("A data informada é muito antiga");
        return;
      }

      mutate({
        initial,
        final,
        adjustment,
        relClient,
        relProject,
        relActivity,
        relUser: id,
        activityDesc,
      });
    }
  );

  // Requests inputs
  const { data: clients } = useQuery(["clients"], () => getClients());

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen((prevState) => !prevState)}>
      <Box sx={{ padding: 4, minWidth: 420 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <Typography variant="h6">Cadastrar horas</Typography>
          <Close
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
            {...register("activityDesc")}
          />
          <Button
            variant="contained"
            color="warning"
            type="submit"
            sx={{ paddingBlock: "1rem" }}
          >
            Cadastrar horas
          </Button>
        </form>
      </Box>
    </Dialog>
  );
}
