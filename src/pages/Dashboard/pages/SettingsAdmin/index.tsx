import { Divider, FormLabel } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import { Permission } from "components/Permission";

export function SettingsAdmin() {
  return (
    <Permission roles={["CONFIGURACOES"]}>
      <h1>Configurações</h1>
      <p>Em Desenvolvimento</p>
      <Divider
        sx={{
          paddingTop: "2rem",
          marginBottom: "2rem",
        }}
      />
      <FormLabel
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.2rem",
          marginBottom: "1rem",
        }}
      >
        Prazo Máximo para Lançar Horas
        <TextField
          required
          color="warning"
          variant="outlined"
          sx={{
            width: "4rem",
          }}
          // {...register("")}
        />
      </FormLabel>

      <p>
        Como ainda não foi implementado, está pré-definido no sistema por padrão
        4 dias
      </p>
      <Divider
        sx={{
          paddingTop: "2rem",
          marginBottom: "2rem",
        }}
      />
      <p>Podemos verificar mais configurações necessárias para adicionar</p>
    </Permission>
  );
}
