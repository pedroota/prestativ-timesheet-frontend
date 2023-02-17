import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "components/ModalGeneral";
import { Permission } from "components/Permission";
import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { ClientsInfo } from "interfaces/clients.interface";
import { currencyMask } from "utils/masks";
import { UserRegister } from "interfaces/users.interface";
import { toast } from "react-toastify";
import { createProjects } from "services/project.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Projects } from "interfaces/projects.interface";
import { useForm } from "react-hook-form";
import { getUserByRole } from "services/auth.service";
import { getClients } from "services/clients.service";

interface ModalRegisterProjectProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalRegisterProject({
  isOpen,
  setIsOpen,
}: ModalRegisterProjectProps) {
  const [nameClient, setNameClient] = useState("");
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [gpProject, setGpProject] = useState("");
  const { data: clientList } = useQuery([], () => getClients());
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  const { register, handleSubmit, reset } = useForm<Projects>({});

  const { mutate, isLoading } = useMutation(
    ({ title, idClient, gpProject, description }: Projects) =>
      createProjects({
        title,
        idClient,
        valueProject: priceNumber,
        gpProject,
        description,
      }),
    {
      onSuccess: () => {
        reset();
        setPrice("");
        // setGpProject("");
        setNameClient("");
        toast.success("Projeto criado com sucesso.");
        setIsOpen((prevState) => !prevState);
      },
      onError: () => {
        toast.error("Erro ao criar o projeto.", {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({ title, idClient, gpProject, description }) => {
      mutate({
        title,
        idClient,
        valueProject: priceNumber,
        gpProject,
        description,
      });
    }
  );

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    const stringValueWithoutDots = stringValue.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Cadastrar projeto">
      <Permission roles={["CADASTRO_PROJETO"]}>
        <form className="c-register-project" onSubmit={onSubmit}>
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
            value={nameClient}
            onChange={(event) => setNameClient(event.target.value)}
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
            value={gpProject}
            onChange={(event) => setGpProject(event.target.value)}
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
          <Button
            type="submit"
            id="button-primary"
            disabled={isLoading}
            variant="contained"
          >
            {isLoading && <CircularProgress size={16} />}
            {!isLoading && "Cadastrar"}
          </Button>
        </form>
      </Permission>
    </Modal>
  );
}
