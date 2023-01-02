import { TextField, Button, MenuItem, Select } from "@mui/material";
import { useForm } from "react-hook-form";

type newUserRegister = {
  name: string;
  surname: string;
  email: string;
  password: string;
  permission: string;
};

export function RegisterUser() {
  const { register, handleSubmit } = useForm<newUserRegister>({});

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="c-register-user" onSubmit={onSubmit}>
      <h1 className="c-register-user--title">Criar um novo usuário</h1>
      <div className="c-register-user--input-container">
        <TextField
          required
          color="warning"
          type="text"
          label="Nome"
          sx={{ width: "100%" }}
          {...register("name")}
        />
        <TextField
          required
          color="warning"
          type="text"
          label="Sobrenome"
          sx={{ width: "100%" }}
          {...register("surname")}
        />
      </div>
      <TextField
        required
        color="warning"
        label="E-mail"
        type="email"
        {...register("email")}
      />
      <TextField
        required
        color="warning"
        label="Password"
        type="password"
        {...register("password")}
      />
      <Select
        labelId="select-label-helper"
        label="Permissão"
        color="warning"
        defaultValue="Consultor"
        {...register("permission")}
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        <MenuItem value="Administrador">Administrador</MenuItem>
        <MenuItem value="Consultor">Consultor</MenuItem>
        <MenuItem value="Operação">Operação</MenuItem>
        <MenuItem value="Gestor de Projetos">Gestor de Projetos</MenuItem>
      </Select>
      <Button id="button-primary" type="submit" variant="contained">
        Cadastrar
      </Button>
    </form>
  );
}
