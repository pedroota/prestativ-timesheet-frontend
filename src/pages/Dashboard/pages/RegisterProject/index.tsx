import { useForm } from "react-hook-form";
import { Button, Select, TextField, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Projects } from "interfaces/projects.interface";
import { getClients } from "services/clients.service";
import { getUserByRole } from "services/auth.service";
import { createProjects } from "services/project.service";

export function RegisterProject() {
  const { data: clientList } = useQuery([], () => getClients());
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  const { register, handleSubmit } = useForm<Projects>({});

  const onSubmit = handleSubmit(
    ({ title, idClient, valueProject, gpProject, description }) => {
      createProjects({
        title,
        idClient,
        valueProject,
        gpProject,
        description,
      });
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
      <Select
        color="warning"
        labelId="select-label-helper"
        {...register("idClient")}
        label="Cliente Relacionado"
        defaultValue=""
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {clientList?.data.map(({ code, name }) => (
          <MenuItem key={code} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Valor"
        {...register("valueProject")}
        color="warning"
        variant="outlined"
      />
      <Select
        color="warning"
        labelId="select-label-helper"
        {...register("gpProject")}
        label="Gerente de Projetos Relacionado"
        defaultValue=""
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {GPList?.data.map(({ name, surname }) => (
          <MenuItem value={name + " " + surname} key={name + " " + surname}>
            {name + " " + surname}
          </MenuItem>
        ))}
      </Select>
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
