import { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { UserRegister } from "interfaces/users.interface";
import Logo from "assets/logo.png";
import { useNavigate } from "react-router-dom";
import { newpass } from "services/auth.service";

export function NewPassword() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, handleSubmit } = useForm<UserRegister>({});
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async ({ email, password, token }) => {
    await newpass({ email, password, token });
    navigate("/");
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
            type="string"
            label="Token recebido no E-mail"
            {...register("token")}
          />
          <TextField
            required
            color="warning"
            type="email"
            label="Seu Email"
            {...register("email")}
          />
          <TextField
            required
            color="warning"
            type={isPasswordVisible ? "text" : "password"}
            label="Sua Nova Senha"
            {...register("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setIsPasswordVisible((prevState) => !prevState)
                    }
                  >
                    {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button id="button-primary" type="submit" variant="contained">
            Redefinir Senha
          </Button>
        </div>
      </form>
    </section>
  );
}
