import { Button, TextField, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { User } from "interfaces/users.interface";
import Logo from "assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgot } from "services/auth.service";
import { toast } from "react-toastify";

export function ForgotPassword() {
  const { register, handleSubmit } = useForm<User>({});
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(
    async (email: string) => await forgot(email),
    {
      onSuccess: () => {
        navigate("/newpass");
        toast.success("Token Enviado para o seu e-mail", {
          autoClose: 4000,
        });
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao gerar o seu Token", {
          autoClose: 2000,
        });
      },
    }
  );

  const onSubmit = handleSubmit(({ email }) => {
    mutate(email);
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
          <Button
            id="button-primary"
            type="submit"
            disabled={isLoading}
            variant="contained"
          >
            {isLoading && <CircularProgress size={16} />}
            {!isLoading && "Enviar Token"}
          </Button>
        </div>
      </form>
    </section>
  );
}
