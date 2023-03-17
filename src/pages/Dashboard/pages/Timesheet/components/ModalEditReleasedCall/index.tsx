import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHoursById, updateReleasedCall } from "services/hours.service";
import { Permission } from "components/Permission";
import { toast } from "react-toastify";

interface ModalEditHoursProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentHour: string;
}

interface FormData {
  releasedCall: string;
}

export function ModalEditReleasedCall({
  isOpen,
  setIsOpen,
  currentHour,
}: ModalEditHoursProps) {
  const { register, handleSubmit, setValue } = useForm<FormData>();

  // Get current hour data
  useQuery(["hours", currentHour], () => getHoursById(currentHour), {
    onSuccess({ data }) {
      setValue("releasedCall", data?.hours?.releasedCall);
    },
    enabled: isOpen,
    staleTime: 5000000,
    refetchOnWindowFocus: false,
  });

  const { mutate, isLoading } = useMutation(
    (releasedCall: FormData) =>
      updateReleasedCall(currentHour, releasedCall.releasedCall),
    {
      onSuccess: () => {
        setIsOpen((prevState) => !prevState);
        toast.success("Chamado Lançado foi atualizado com sucesso.");
      },
      onError: () => {
        toast.error("Ocorreu um erro ao atualizar Chamado Lançado.", {
          autoClose: 1000,
        });
      },
    }
  );

  const onSubmit = handleSubmit((releasedCall) => mutate(releasedCall));

  return (
    <Permission roles={["EDITAR_CHAMADO_LANCADO"]}>
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
            <Typography fontSize="1.3rem">Editar Chamado Lançado</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <Permission roles={["EDITAR_CHAMADO_LANCADO"]}>
              <TextField
                color="warning"
                multiline
                rows={4}
                variant="outlined"
                label="Chamado Lançado"
                InputLabelProps={{ shrink: true }}
                {...register("releasedCall")}
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
