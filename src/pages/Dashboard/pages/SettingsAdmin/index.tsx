import TextField from "@mui/material/TextField/TextField";

export function SettingsAdmin() {
  return (
    <div>
      <h1>Configurações</h1>
      <p>Em Desenvolvimento</p>

      <TextField
        required
        color="warning"
        variant="outlined"
        label="Prazo Máximo para Lançar Horas"
        // {...register("")}
      />
    </div>
  );
}
