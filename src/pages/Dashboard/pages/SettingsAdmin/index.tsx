import TextField from "@mui/material/TextField/TextField";
import { Permission } from "components/Permission";

export function SettingsAdmin() {
  return (
    <Permission roles={["CONFIGURACOES"]}>
      <h1>Configurações</h1>
      <p>Em Desenvolvimento</p>

      <TextField
        required
        color="warning"
        variant="outlined"
        label="Prazo Máximo para Lançar Horas"
        // {...register("")}
      />
    </Permission>
  );
}
