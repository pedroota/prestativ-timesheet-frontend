import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  Dialog,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByRole } from "services/auth.service";
import { UserRegister } from "interfaces/users.interface";
import { Projects } from "interfaces/projects.interface";
import { getClients } from "services/clients.service";
import { Clients } from "interfaces/clients.interface";
import { updateProjects, getProjectById } from "services/project.service";
import { Permission } from "components/Permission";

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
  const queryClient = useQueryClient();
  const { data: clientList } = useQuery([], () => getClients());
  useQuery(["projects", currentProject], () => getProjectById(currentProject), {
    onSuccess: ({ data }) => reset(data.project),
  });
  const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  function findGpId() {
    return listGps?.data[0]._id;
  }

  const { mutate } = useMutation(
    ({ title, idClient, valueProject, gpProject, description }: Projects) =>
      updateProjects(currentProject, {
        title,
        idClient,
        valueProject,
        gpProject,
        description,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );
  const { register, reset, handleSubmit } = useForm<Projects>();

  const onSubmit = handleSubmit(
    ({ title, idClient, valueProject, gpProject, description }) => {
      mutate({ title, idClient, valueProject, gpProject, description });
      reset();
    }
  );

  return (
    <Permission roles={["EDITAR_PROJETO"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4, minWidth: 420 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar projeto</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <p>Informações do projeto</p>
            <TextField
              label="Nome do Projeto"
              {...register("title")}
              color="warning"
              variant="outlined"
            />
            <TextField
              color="warning"
              select
              {...register("idClient")}
              label="Cliente"
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
            <Select
              color="warning"
              labelId="select-label-helper"
              {...register("gpProject")}
              sx={{ display: "none" }}
              label="Gerente de Projetos"
              value={findGpId()}
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {listGps?.data.map(
                ({ name, surname, _id }: UserRegister, index: number) => (
                  <MenuItem value={_id} key={index}>
                    {`${name} ${surname}`}
                  </MenuItem>
                )
              )}
            </Select>
            <TextField
              label="Descrição do Projeto"
              {...register("description")}
              color="warning"
              variant="outlined"
            />
            <Button
              sx={{ paddingBlock: "1rem" }}
              variant="contained"
              color="warning"
              type="submit"
            >
              Concluído
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}
