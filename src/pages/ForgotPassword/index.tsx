import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { User } from "interfaces/users.interface";
import Logo from "assets/logo.png";
import { useNavigate } from "react-router-dom";
import { forgot } from "services/auth.service";

export function ForgotPassword() {
  const { register, handleSubmit } = useForm<User>({});
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async ({ email }) => {
    await forgot(email);
    navigate("/newpass");
  });

  return (
    <section className="c-login">
      <form className="c-login--form" onSubmit={onSubmit}>
        <img src={Logo} alt="PrestativSAP Logo" />
        <p className="c-login--description">
          Insira seu email para solicitar o token de redefinição de senha:
        </p>
        <div>
          <TextField
            required
            color="warning"
            type="email"
            label="Seu Email"
            {...register("email")}
          />
          <Button id="button-primary" type="submit" variant="contained">
            Enviar Token
          </Button>
        </div>
      </form>
    </section>
  );
}
