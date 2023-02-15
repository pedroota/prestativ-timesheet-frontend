import { useState } from "react";
import { Button, MenuItem, TextField, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Projects, RegisterProject } from "interfaces/projects.interface";
import { getClients } from "services/clients.service";
import { updateProjects, getProjectById } from "services/project.service";
import { Permission } from "components/Permission";
import { toast } from "react-toastify";
import { Modal } from "components/ModalGeneral";
import { ClientsInfo } from "interfaces/clients.interface";
import { currencyMask } from "utils/masks";

interface ModalEditUserProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProject: string;
}

export function ModalEditProject({
  isOpen,
  setIsOpen,
  currentProject,
}: ModalEditUserProps) {
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [currentClient, setCurrentClient] = useState("");
  const [currentGp, setCurrentGp] = useState("");
  const queryClient = useQueryClient();
  const { data: clientsList } = useQuery(["clients"], () => getClients(), {
    onSuccess(data) {
      console.log(data, "<<< clientes");
    },
  });

  const setNewPrice = (value: string) => {
    setPrice(value);
    setPriceNumber(Number(value.slice(2)));
  };

  useQuery(["projects", currentProject], () => getProjectById(currentProject), {
    onSuccess: ({ data }) => {
      data.project.idClient && setCurrentClient(data.project?.idClient._id);
      data.project.gpProject && setCurrentGp(data.project.gpProject._id);
      data.client.valueProject && setPrice(`${data.client.valueProject}`);
      reset(data.project);
      console.log(data);
    },
  });
  // const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
  //   getUserByRole("gerenteprojetos")
  // );

  const { mutate, isLoading } = useMutation(
    ({ title, idClient, gpProject, description }: RegisterProject) =>
      updateProjects(currentProject, {
        title,
        idClient,
        valueProject: priceNumber,
        gpProject,
        description,
      } as RegisterProject),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
        setIsOpen((prevState) => !prevState);
        toast.success("Projeto foi atualizado com sucesso!");
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao editar este Projeto!", {
          autoClose: 1500,
        });
      },
    }
  );

  const { register, reset, handleSubmit } = useForm<Projects>();

  const onSubmit = handleSubmit(({ title, valueProject, description }) => {
    mutate({
      title,
      idClient: currentClient,
      valueProject,
      description,
      gpProject: currentGp,
    });
    setCurrentClient("");
    reset();
  });

  return (
    <Permission roles={["EDITAR_PROJETO"]}>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Editar projeto">
        <form className="c-form-spacing" onSubmit={onSubmit}>
          <p>Informações do projeto</p>
          <TextField
            label="Nome do Projeto"
            {...register("title")}
            color="warning"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <TextField
            color="warning"
            select
            InputLabelProps={{ shrink: true }}
            label="Cliente"
            value={currentClient}
            onChange={(event) => setCurrentClient(event.target.value)}
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
            {clientsList?.data.map(({ _id, name }: ClientsInfo) => (
              <MenuItem key={_id} value={_id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor"
            {...register("valueProject")}
            InputLabelProps={{ shrink: true }}
            value={price && currencyMask(price)}
            color="warning"
            variant="outlined"
            onChange={(event) => setNewPrice(event.target.value)}
          />
          {/* <Select
            color="warning"
            labelId="select-label-helper"
            label="Gerente de Projetos"
            value={currentGp}
            onChange={(event) => setCurrentGp(event.target.value)}
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
            {listGps?.data.map(
              ({ name, surname, _id }: UserRegister, index: number) => (
                <MenuItem value={_id} key={index}>
                  {`${name} ${surname}`}
                </MenuItem>
              )
            )}
          </Select> */}
          <TextField
            label="Descrição do Projeto"
            {...register("description")}
            InputLabelProps={{ shrink: true }}
            color="warning"
            variant="outlined"
          />
          <Button
            sx={{ paddingBlock: "1rem" }}
            variant="contained"
            color="warning"
            type="submit"
          >
            {isLoading && <CircularProgress size={16} />}
            {!isLoading && "Concluído"}
          </Button>
        </form>
      </Modal>
    </Permission>
  );
}
