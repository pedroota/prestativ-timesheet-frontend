import { useContext } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { AuthContext } from "context/AuthContext";
import { useForm } from "react-hook-form";
import { UserRegister } from "interfaces/users.interface";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "services/roles.service";
import { Roles } from "interfaces/roles.interface";
import { validateEmail } from "utils/validator";
import { toast } from "react-toastify";

export function RegisterUser() {
  const { data } = useQuery(["roles"], getRoles);
  const { signUp } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm<UserRegister>({});

  const onSubmit = handleSubmit(({ name, surname, email, password, role }) => {
    if (validateEmail(email)) {
      signUp({ name, surname, email, password, role }).then(() => {
        reset();
      });
    } else {
      toast.error("O Email digitado é inválido.");
    }
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
      <TextField
        label="Perfil do Usuário"
        select
        color="warning"
        defaultValue="Consultor"
        {...register("role")}
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {data?.data.map((role: Roles) => (
          <MenuItem value={role?.name} key={role?.name}>
            {role?.name}
          </MenuItem>
        ))}
      </TextField>
      <Button id="button-primary" type="submit" variant="contained">
        Cadastrar
      </Button>
    </form>
  );
}
