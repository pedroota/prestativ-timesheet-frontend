import { useState, Dispatch, SetStateAction } from "react";
import {
  Dialog,
  Box,
  TextField,
  Typography,
  MenuItem,
  FormLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getHoursById, updateHours } from "services/hours.service";
import { Permission } from "components/Permission";
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  convertDate,
  generateTimestampWithDateAndTime,
  generateMilisecondsWithTime,
} from "utils/timeControl";
import { UpdateHoursProps } from "interfaces/hours.interface";
import { toast } from "react-toastify";
import { useAuthStore } from "stores/userStore";

interface ModalEditHoursProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentHour: string;
}

interface FormData {
  initialDate: string;
  adjustment: number;
  initialHour: string;
  finalHour: string;
  activityDesc: string;
  releasedCall: string;
}

export function ModalEditHours({
  isOpen,
  setIsOpen,
  currentHour,
}: ModalEditHoursProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [selectedActivity, setSelectedActivity] = useState("");
  const { register, handleSubmit, setValue } = useForm<FormData>();

  // Get current hour data
  useQuery(["hours", currentHour], () => getHoursById(currentHour), {
    onSuccess({ data }) {
      setValue(
        "initialDate",
        convertDate(generateDateWithTimestamp(data?.hours?.initial))
      );

      setValue("initialHour", generateTimeWithTimestamp(data?.hours?.initial));
      setValue("finalHour", generateTimeWithTimestamp(data?.hours?.final));
      data.hours &&
        data?.hours.adjustment !== 0 &&
        setValue(
          "adjustment",
          Number(generateTimeWithTimestamp(data?.hours?.adjustment))
        );
      setValue("activityDesc", data?.hours?.activityDesc);
      setValue("releasedCall", data?.hours?.releasedCall);
      setSelectedActivity(data.hours && data.hours.relActivity._id);
    },
    enabled: isOpen,
    staleTime: 5000000,
    refetchOnWindowFocus: false,
  });

  const { mutate, isLoading } = useMutation(
    ({
      initial,
      final,
      adjustment,
      relActivity,
      relUser,
      activityDesc,
    }: UpdateHoursProps) =>
      updateHours(currentHour, {
        initial,
        final,
        adjustment,
        relActivity,
        relUser,
        activityDesc,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hours"]);
        setIsOpen((prevState) => !prevState);
      },
      onError: () => {
        toast.error("Ocorreu um erro ao atualizar as horas.", {
          autoClose: 1000,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({ activityDesc, adjustment, finalHour, initialDate, initialHour }) => {
      const initial = generateTimestampWithDateAndTime(
        initialDate,
        initialHour
      );
      const final = generateTimestampWithDateAndTime(initialDate, finalHour);
      if (initial > final) {
        toast.error("A hora final não pode ser anterior a hora inicial!");
        return;
      }
      const adjusted = generateMilisecondsWithTime(adjustment);
      const maxDaysCanRelease = 4; // Periodo máximo para lançar horas - editando essa variável, o sistema irá permitir que datas mais antigas sejam possiveis lançar
      const daysInMiliseconds = maxDaysCanRelease * 1000 * 60 * 60 * 24;
      const today = Date.now();
      if (initial > today + daysInMiliseconds / maxDaysCanRelease) {
        toast.error("A data informada não é permitida");
        return;
      }
      if (initial < today - daysInMiliseconds) {
        toast.error("A data informada não é permitida");
        return;
      }
      mutate({
        initial,
        final,
        activityDesc,
        adjustment: adjusted,
        relActivity: selectedActivity,
        relUser: user._id,
      });
      toast.success("Lançamento alterado com sucesso");
    }
  );

  // botão DIA DE HOJE
  const [chosenDay, setChosenDay] = useState("");

  const setDay = (e: { target: { value: SetStateAction<string> } }) => {
    setChosenDay(e.target.value);
  };

  return (
    <Permission roles={["EDITAR_HORAS"]}>
      <Dialog
        open={isOpen}
        onClose={() => {
          currentHour = "";
          setIsOpen((prevState) => !prevState);
        }}
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
            <Permission
              roles={["EDITAR_CAMPOS_HORAS_LANCADAS" || "EDITAR_AJUSTE"]}
            >
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Permission roles={["EDITAR_CAMPOS_HORAS_LANCADAS"]}>
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
                </Permission>
                <Permission roles={["EDITAR_AJUSTE"]}>
                  <FormLabel
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                    }}
                  >
                    Ajuste em Minutos
                    <TextField
                      type="text"
                      color="warning"
                      variant="outlined"
                      {...register("adjustment")}
                    />
                  </FormLabel>
                </Permission>
              </Box>
            </Permission>
            <Permission roles={["EDITAR_CAMPOS_HORAS_LANCADAS"]}>
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
            </Permission>

            <Permission roles={["EDITAR_CAMPOS_HORAS_LANCADAS"]}>
              <TextField
                required
                color="warning"
                variant="outlined"
                label="Atividade"
                InputLabelProps={{ shrink: true }}
                value={selectedActivity}
                select
                onChange={(event) => setSelectedActivity(event.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione uma opção
                </MenuItem>
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
            </Permission>
            <Button
              variant="contained"
              color="warning"
              type="submit"
              disabled={isLoading}
              sx={{ paddingBlock: "1rem" }}
            >
              {isLoading && <CircularProgress size={16} />}
              {!isLoading && "Concluído"}
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}
