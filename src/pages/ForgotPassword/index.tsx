import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { User } from "interfaces/users.interface";
import Logo from "assets/logo.png";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const { signIn } = useContext(AuthContext);
  const { register, handleSubmit } = useForm<User>({});
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async ({ email, password }) => {
    await signIn({ email, password }).then(() =>
      navigate("/dashboard/timesheet")
    );
  });

  return (
    <section className="c-login">
      <form className="c-login--form" onSubmit={onSubmit}>
        <img src={Logo} alt="PrestativSAP Logo" />
        <p className="c-login--description">Redefina sua senha abaixo.</p>
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
            label="Nova Senha"
            type="password"
            {...register("password")}
          />
          <TextField
            required
            id="input-primary"
            color="warning"
            label="Confirme a Nova Senha"
            type="confirm-password"
            {...register("password")}
          />
          <Button id="button-primary" type="submit" variant="contained">
            Redefinir
          </Button>
        </div>
      </form>
    </section>
  );
}
