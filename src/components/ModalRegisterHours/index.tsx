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
      callNumber,
    }: RegisterHours) =>
      createHours({
        initial,
        final,
        adjustment,
        relClient,
        relProject,
        relActivity,
        relUser,
        callNumber,
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
      finalDate,
      initialHour,
      finalHour,
      relClient,
      relProject,
      relActivity,
      callNumber,
    }) => {
      const initial = generateTimestampWithDateAndTime(
        initialDate,
        initialHour
      );
      const final = generateTimestampWithDateAndTime(finalDate, finalHour);
      const adjustment = 0; // Presets the adjusment property to 0, just GPs and ADMs can change it
      const { id } = decodeJwt(`${user}`);
      mutate({
        initial,
        final,
        adjustment,
        relClient,
        relProject,
        relActivity,
        relUser: id,
        callNumber,
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
            <FormLabel
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              }}
            >
              Data inicial
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
              Data final
              <TextField
                type="date"
                color="warning"
                variant="outlined"
                required
                {...register("finalDate")}
              />
            </FormLabel>
          </Box>

          <Box sx={{ display: "flex", gap: "1rem" }}>
            <TextField
              required
              color="warning"
              variant="outlined"
              label="Cliente relacionado"
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
              label="Projeto relacionado"
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
            label="Atividade relacionada"
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
            variant="outlined"
            label="Número do chamado"
            {...register("callNumber")}
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
