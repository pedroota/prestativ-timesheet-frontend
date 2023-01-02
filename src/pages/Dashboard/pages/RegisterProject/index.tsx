import { useForm } from "react-hook-form";
import { Button, Select, TextField, MenuItem } from "@mui/material";

export function RegisterProject() {
  const { register, handleSubmit } = useForm({});

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  // Isso é somente para exemplificar como receberá do backend
  const clients = [
    {
      name: "Meta",
    },
    {
      name: "Gerdau",
    },
    {
      name: "Accenture",
    },
  ];

  return (
    <form className="c-register-project" onSubmit={onSubmit}>
      <h1 className="c-register-project--title">Cadastrar novo projeto</h1>
      <p>Informações do projeto</p>
      <TextField
        label="Nome do Projeto"
        {...register("name-project")}
        color="warning"
        variant="outlined"
      />
      <TextField
        label="Valor"
        {...register("value-project")}
        color="warning"
        variant="outlined"
      />
      <TextField
        label="Numero do Chamado"
        {...register("numero-chamado")}
        color="warning"
        variant="outlined"
      />
      <TextField
        label="Descrição do Projeto"
        {...register("project-description")}
        color="warning"
        variant="outlined"
      />
      <Select
        color="warning"
        labelId="select-label-helper"
        {...register("client")}
        label="Empresa ou Cliente Relacionado"
        defaultValue=""
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {clients.map(({ name }) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
      <Button type="submit" id="button-primary" variant="contained">
        Cadastrar
      </Button>
    </form>
  );
}
