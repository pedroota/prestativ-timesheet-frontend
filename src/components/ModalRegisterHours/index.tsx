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
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { generateTimestampWithDateAndTime } from "utils/timeControl";
import { RegisterHours } from "interfaces/hours.interface";
import { createHours } from "services/hours.service";
import { useState } from "react";
import { getClients } from "services/clients.service";
import { ClientsInfo } from "interfaces/clients.interface";
import { ProjectsInfo } from "interfaces/projects.interface";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { toast } from "react-toastify";
import { useAuthStore } from "stores/userStore";
interface ModalRegisterHoursProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalRegisterHours({
  isOpen,
  setIsOpen,
}: ModalRegisterHoursProps) {
  const user = useAuthStore((state) => state.user);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { mutate, isLoading } = useMutation(
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
        toast.success("Lançamento efetuado com sucesso");
      },
      onError: () => {
        toast.error("Erro ao tentar efetuar esse lançamento.", {
          autoClose: 1000,
        });
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
      if (!initialDate) {
        initialDate = chosenDay;
      }
      const initial = generateTimestampWithDateAndTime(
        initialDate,
        initialHour
      );
      const final = generateTimestampWithDateAndTime(initialDate, finalHour);
      if (initial > final) {
        toast.error("A hora final não pode ser anterior a hora inicial!");
        return;
      }
      const maxDaysCanRelease = 4; // Periodo máximo para lançar horas - editando essa variável, o sistema irá permitir que datas mais antigas sejam possiveis lançar
      const daysInMiliseconds = maxDaysCanRelease * 1000 * 60 * 60 * 24;
      const today = Date.now();
      const adjustment = 0; // Presets the adjusment property to 0, just ADMs can change it
      if (initial > today + daysInMiliseconds / maxDaysCanRelease) {
        toast.error("A data informada ainda não está disponível");
        return;
      }
      if (initial < today - daysInMiliseconds) {
        toast.error("A data informada não está disponível");
        return;
      }

      mutate({
        initial,
        final,
        adjustment,
        relClient,
        relProject,
        relActivity,
        relUser: user._id,
        activityDesc,
      });
    }
  );

  // Requests inputs
  const { data: clients } = useQuery(["clients"], () => getClients());

  // botão DIA DE HOJE
  const [chosenDay, setChosenDay] = useState("");

  const setDay = (e: { target: { value: string } }) => {
    setChosenDay(e.target.value);
  };

  const setToday = (yesterday: number) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() - yesterday;
    const string = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    setChosenDay(string);
  };

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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              gap: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="warning"
              onClick={() => setToday(0)}
            >
              Hoje
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => setToday(1)}
            >
              Ontem
            </Button>
          </Box>
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
              value={chosenDay}
              {...register("initialDate")}
              onChange={setDay}
            />
          </FormLabel>
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
            {...register("activityDesc")}
          />
          <Button
            variant="contained"
            color="warning"
            disabled={isLoading}
            type="submit"
            sx={{ paddingBlock: "1rem" }}
          >
            {isLoading && <CircularProgress size={16} />}
            {!isLoading && "Cadastrar"}
          </Button>
        </form>
      </Box>
    </Dialog>
  );
}
