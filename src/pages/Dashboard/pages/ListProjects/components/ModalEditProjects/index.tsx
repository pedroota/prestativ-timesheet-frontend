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
import { updateProjects } from "services/project.service";

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
  // const { data: actualProject } = useQuery([], () => getProjectById(currentProject));
  const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
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
  const { register, reset, handleSubmit } = useForm<Projects>({});

  const onSubmit = handleSubmit(
    ({ title, idClient, valueProject, gpProject, description }) => {
      mutate({ title, idClient, valueProject, gpProject, description });
      reset();
    }
  );

  return (
    <div>
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
              // defaultValue={}
            />
            <Select
              color="warning"
              labelId="select-label-helper"
              {...register("idClient")}
              label="Cliente Relacionado"
              defaultValue=""
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {clientList?.data.map(({ code, name }: Clients) => (
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
              {listGps?.data.map(
                ({ name, surname }: UserRegister, index: number) => (
                  <MenuItem value={`${name} ${surname}`} key={index}>
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
    </div>
  );
}
