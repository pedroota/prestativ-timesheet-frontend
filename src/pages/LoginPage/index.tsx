import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { User } from "interfaces/users.interface";
import Logo from "assets/logo.png";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
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
          <a href="/forgotpass">
            <p
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Esqueci Minha Senha
            </p>
          </a>
        </div>
      </form>
    </section>
  );
}
