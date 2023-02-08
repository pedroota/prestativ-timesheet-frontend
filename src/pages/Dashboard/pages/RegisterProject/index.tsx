import { useForm } from "react-hook-form";
import { Button, TextField, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Projects } from "interfaces/projects.interface";
import { getClients } from "services/clients.service";
import { getUserByRole } from "services/auth.service";
import { createProjects } from "services/project.service";
import { UserRegister } from "interfaces/users.interface";
import { ClientsInfo } from "interfaces/clients.interface";
import { toast } from "react-toastify";
import { Permission } from "components/Permission";
import { currencyMask } from "utils/masks";
import { useState } from "react";

export function RegisterProject() {
  const { data: clientList } = useQuery([], () => getClients());
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );
  const { register, handleSubmit, reset } = useForm<Projects>({});

  const onSubmit = handleSubmit(
    ({ title, idClient, gpProject, description }) => {
      createProjects({
        title,
        idClient,
        valueProject: priceNumber,
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

  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    setPrice(stringValue);
    setPriceNumber(Number(stringValue.slice(2)));
  };

  return (
    <Permission roles={["CADASTRO_PROJETO"]}>
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
          label="Cliente"
          select
          defaultValue=""
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {clientList?.data.map(({ code, name, _id }: ClientsInfo) => (
            <MenuItem key={code} value={_id}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Valor"
          color="warning"
          variant="outlined"
          value={price && currencyMask(price)}
          {...register("valueProject")}
          onChange={(event) => setNewPrice(event)}
        />
        <TextField
          color="warning"
          {...register("gpProject")}
          label="Gerente de Projetos"
          select
          defaultValue=""
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {GPList?.data.map(({ name, surname, _id }: UserRegister) => (
            <MenuItem value={_id} key={_id}>
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
    </Permission>
  );
}
