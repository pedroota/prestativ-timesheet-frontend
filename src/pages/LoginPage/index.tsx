import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { User } from "interfaces/users.interface";
import Logo from "assets/logo.png";

export function LoginPage() {
  const { register, handleSubmit } = useForm<User>({});

  const onSubmit = handleSubmit(({ email, password }) => {
    console.log(email, password);
  });

  return (
    <section className="c-login">
      <form className="c-login--form" onSubmit={onSubmit}>
        <img src={Logo} alt="PrestativSAP Logo" />
        <p className="c-login--description">
          Seja bem-vindo! Preencha as informações abaixo.
        </p>
        <div>
          <TextField
            required
            color="warning"
            type="email"
            label="Seu Email"
            {...register("email")}
          />
          <TextField
            required
            id="input-primary"
            color="warning"
            label="Password"
            type="password"
            {...register("password")}
          />
          <Button id="button-primary" type="submit" variant="contained">
            Acessar
          </Button>
        </div>
      </form>
    </section>
  );
}
