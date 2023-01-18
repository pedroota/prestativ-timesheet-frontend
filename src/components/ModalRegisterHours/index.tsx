import { Close } from "@mui/icons-material";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  FormLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";

interface ModalRegisterHoursProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalRegisterHours({
  isOpen,
  setIsOpen,
}: ModalRegisterHoursProps) {
  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

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
              color="warning"
              variant="outlined"
              label="Cliente relacionado"
            />
            <TextField
              color="warning"
              variant="outlined"
              label="Projeto relacionado"
            />
          </Box>

          <Box sx={{ display: "flex", gap: "1rem" }}>
            <TextField
              color="warning"
              variant="outlined"
              label="Atividade relacionado"
            />
            <TextField
              color="warning"
              variant="outlined"
              label="Consultor relacionado"
            />
          </Box>
          <TextField
            color="warning"
            variant="outlined"
            label="Número do chamado"
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
