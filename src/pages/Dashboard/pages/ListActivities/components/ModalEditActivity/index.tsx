import { useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UserRegister } from "interfaces/users.interface";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateActivity, getActivityById } from "services/activities.service";
import { Activities } from "interfaces/activities.interface";
import { getUserByRole } from "services/auth.service";
import { getProjects } from "services/project.service";
import { Projects } from "interfaces/projects.interface";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface ModalEditActivityProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentActivity: string;
}

export function ModalEditActivity({
  isOpen,
  setIsOpen,
  currentActivity,
}: ModalEditActivityProps) {
  const { data: singleActivity } = useQuery(
    ["activity", currentActivity],
    () => getActivityById(currentActivity),
    {
      onSuccess: ({ data }) => {
        reset(data.activity);
      },
    }
  );
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ({
      title,
      project,
      description,
      gpActivity,
      users,
      closedScope,
      valueActivity,
    }: Activities) =>
      updateActivity(currentActivity, {
        title,
        project,
        description,
        gpActivity,
        users,
        closedScope,
        valueActivity,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activities"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );
  const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  const { data: consultantList } = useQuery(["users-gp", "Consultor"], () =>
    getUserByRole("Consultor")
  );
  const { data: projectList } = useQuery(["projects"], getProjects);
  const { register, reset, handleSubmit } = useForm<Activities>({
    defaultValues: singleActivity?.data.activity,
  });

  const onSubmit = handleSubmit(
    ({
      title,
      project,
      description,
      gpActivity,
      users,
      valueActivity,
      closedScope,
    }) => {
      mutate({
        title,
        project,
        description,
        gpActivity,
        users,
        valueActivity,
        closedScope,
      });
      reset();
    }
  );

  const multipleSelectChange = (
    event: SelectChangeEvent<typeof multipleSelect>
  ) => {
    setMultipleSelect(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen((prevState) => !prevState)}>
      <Box sx={{ minWidth: 400, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontSize="1.3rem">Editar atividade</Typography>
          <Close
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={() => setIsOpen((prevState) => !prevState)}
          />
        </Box>
        <form className="c-form-spacing" onSubmit={onSubmit}>
          <TextField
            required
            color="warning"
            label="Nome da atividade"
            InputLabelProps={{ shrink: true }}
            type="text"
            {...register("title")}
          />
          <Select
            color="warning"
            labelId="select-label-helper"
            {...register("project")}
            required
            label="Projeto relacionado"
            defaultValue=""
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
            {projectList?.data.map(({ title }: Projects) => (
              <MenuItem key={title} value={title}>
                {title}
              </MenuItem>
            ))}
          </Select>
          <TextField
            required
            color="warning"
            label="Valor da atividade"
            type="number"
            InputLabelProps={{ shrink: true }}
            {...register("valueActivity")}
          />
          <TextField
            required
            color="warning"
            label="Observação"
            type="text"
            InputLabelProps={{ shrink: true }}
            {...register("description")}
          />
          <div className="c-register-activity--input-container">
            <Select
              color="warning"
              required
              labelId="select-label-helper"
              {...register("gpActivity")}
              sx={{ width: "100%" }}
              defaultValue=""
              label="Gerente de projetos relacionado"
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {listGps?.data.map(
                ({ name, surname, _id }: UserRegister, index: number) => (
                  <MenuItem key={index} value={_id}>
                    {`${name} ${surname}`}
                  </MenuItem>
                )
              )}
            </Select>
            <Select
              color="warning"
              labelId="select-label-helper"
              {...register("users")}
              sx={{ width: "100%" }}
              value={multipleSelect}
              onChange={multipleSelectChange}
              multiple
              required
              label="Consultores relacionado"
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {consultantList?.data.map(
                ({ name, surname }: UserRegister, index: number) => (
                  <MenuItem key={index} value={`${name} ${surname}`}>
                    {`${name} ${surname}`}
                  </MenuItem>
                )
              )}
            </Select>
            <FormControlLabel
              control={<Checkbox defaultChecked {...register("closedScope")} />}
              label="Escopo Fechado"
            />
          </div>

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
  );
}
