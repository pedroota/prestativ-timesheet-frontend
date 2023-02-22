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
  generateAdjustmentWithNumberInMilliseconds,
  generateMilisecondsWithHoursAndMinutes,
} from "utils/timeControl";
import { UpdateHoursProps } from "interfaces/hours.interface";
import { toast } from "react-toastify";

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
  const [selectedActivity, setSelectedActivity] = useState("");
  const [nameActivity, setNameActivity] = useState("");
  const [adjustmentString, setAdjustmentString] = useState("");
  const [actualUser, setActualUser] = useState("");
  const { register, handleSubmit, setValue } = useForm<FormData>();

  // Get current hour data
  useQuery(["hours", currentHour], () => getHoursById(currentHour), {
    onSuccess({ data }) {
      setChosenDay(
        convertDate(generateDateWithTimestamp(data?.hours?.initial))
      );
      setValue("initialHour", generateTimeWithTimestamp(data?.hours?.initial));
      setValue("finalHour", generateTimeWithTimestamp(data?.hours?.final));
      const adjustment = generateAdjustmentWithNumberInMilliseconds(
        data?.hours?.adjustment
      );
      setActualUser(data?.hours?.relUser._id);
      setAdjustmentString(adjustment);
      setValue("activityDesc", data?.hours?.activityDesc);
      setValue("releasedCall", data?.hours?.releasedCall);
      setSelectedActivity(data?.hours?.relActivity._id);
      setNameActivity(data?.hours?.relActivity.title);
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

  const onSubmit = handleSubmit(({ activityDesc, finalHour, initialHour }) => {
    const initial = generateTimestampWithDateAndTime(chosenDay, initialHour);
    const final = generateTimestampWithDateAndTime(chosenDay, finalHour);
    if (initial > final) {
      toast.error("A hora final não pode ser anterior a hora inicial!");
      return;
    }
    const adjusted = generateMilisecondsWithHoursAndMinutes(adjustmentString);
    mutate({
      initial,
      final,
      activityDesc,
      adjustment: adjusted,
      relActivity: selectedActivity,
      relUser: actualUser,
    });
    toast.success("Lançamento alterado com sucesso");
  });

  // botão DIA DE HOJE
  const [chosenDay, setChosenDay] = useState("");

  const setDay = (value: SetStateAction<string>) => {
    setChosenDay(value);
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
                      disabled
                      required
                      value={chosenDay}
                      onChange={(event) => setDay(event.target.value)}
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
                    Ajuste
                    <TextField
                      type="time"
                      color="warning"
                      variant="outlined"
                      value={adjustmentString}
                      onChange={(event) =>
                        setAdjustmentString(event.target.value)
                      }
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
                    disabled
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
                    disabled
                    required
                    {...register("finalHour")}
                  />
                </FormLabel>
              </Box>
            </Permission>

            <Permission roles={["EDITAR_CAMPOS_HORAS_LANCADAS"]}>
              <TextField
                required
                contentEditable={false}
                disabled={true}
                color="warning"
                variant="outlined"
                label="Atividade"
                InputLabelProps={{ shrink: true }}
                value={nameActivity}
                defaultValue={selectedActivity}
              >
                <MenuItem
                  selected={true}
                  value={selectedActivity}
                  key={selectedActivity}
                >
                  {nameActivity}
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
