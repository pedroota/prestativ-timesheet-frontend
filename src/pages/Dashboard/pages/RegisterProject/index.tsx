import { useForm } from "react-hook-form";
import { Button, TextField, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Projects } from "interfaces/projects.interface";
import { getClients } from "services/clients.service";
import { getUserByRole } from "services/auth.service";
import { createProjects } from "services/project.service";
import { UserRegister } from "interfaces/users.interface";
import { Clients } from "interfaces/clients.interface";
import { toast } from "react-toastify";

export function RegisterProject() {
  const { data: clientList } = useQuery([], () => getClients());
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  const { register, handleSubmit, reset } = useForm<Projects>({});

  const onSubmit = handleSubmit(
    ({ title, idClient, valueProject, gpProject, description }) => {
      createProjects({
        title,
        idClient,
        valueProject,
        gpProject,
        description,
      })
        .then(() => {
          reset();
          toast.success("Projeto criado com sucesso.");
        })
        .catch(() => toast.error("Erro ao criar o projeto."));
    }
  );

  return (
    <form className="c-register-project" onSubmit={onSubmit}>
      <h1 className="c-register-project--title">Cadastrar novo projeto</h1>
      <p>Informações do projeto</p>
      <TextField
        label="Nome do Projeto"
        {...register("title")}
        color="warning"
        variant="outlined"
      />
      <TextField
        color="warning"
        {...register("idClient")}
        label="Cliente Relacionado"
        select
        defaultValue=""
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {clientList?.data.map(({ code, name }: Clients) => (
          <MenuItem key={code} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Valor"
        {...register("valueProject")}
        color="warning"
        variant="outlined"
      />
      <TextField
        color="warning"
        {...register("gpProject")}
        label="Gerente de Projetos Relacionado"
        select
        defaultValue=""
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {GPList?.data.map(({ name, surname }: UserRegister, index: number) => (
          <MenuItem value={`${name} ${surname}`} key={index}>
            {`${name} ${surname}`}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Descrição do Projeto"
        {...register("description")}
        color="warning"
        variant="outlined"
      />
      <Button type="submit" id="button-primary" variant="contained">
        Cadastrar
      </Button>
    </form>
  );
}
