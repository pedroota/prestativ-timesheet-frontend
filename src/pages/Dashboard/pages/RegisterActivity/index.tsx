import {
  Button,
  Select,
  TextField,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "services/project.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getUserByRole } from "services/auth.service";
import { createActivities } from "services/activities.service";
import { Projects } from "interfaces/projects.interface";
import { UserRegister } from "interfaces/users.interface";
import { toast } from "react-toastify";
import { Activities } from "interfaces/activities.interface";

export function RegisterActivity() {
  const { data: projectList } = useQuery(["client-project"], () =>
    getProjects()
  );
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  const { data: consultantList } = useQuery(
    ["user-consultant", "Consultor"],
    () => getUserByRole("Consultor")
  );
  const { register, handleSubmit, reset } = useForm<Activities>({});
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);

  const onSubmit = handleSubmit(
    ({
      title,
      project,
      valueActivity,
      gpActivity,
      description,
      userString,
    }) => {
      createActivities({
        title,
        project,
        valueActivity,
        gpActivity,
        description,
        userString,
      })
        .then(() => {
          reset();
          toast.success("Atividade cadastrada com sucesso.");
        })
        .catch(() => toast.error("Erro ao cadastrar a atividade."));
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
    <form className="c-register-activity" onSubmit={onSubmit}>
      <h1>Cadastrar atividade</h1>
      <TextField
        required
        color="warning"
        label="Nome da atividade"
        type="text"
        {...register("title")}
      />
      <Select
        color="warning"
        labelId="select-label-helper"
        {...register("project")}
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
        type="text"
        {...register("valueActivity")}
      />
      <TextField
        required
        color="warning"
        label="Observação"
        type="text"
        {...register("description")}
      />
      <div className="c-register-activity--input-container">
        <Select
          color="warning"
          labelId="select-label-helper"
          {...register("gpActivity")}
          sx={{ width: "100%" }}
          label="Gerente de projetos relacionado"
          defaultValue=""
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {GPList?.data.map(
            ({ name, surname }: UserRegister, index: number) => (
              <MenuItem key={index} value={`${name} ${surname}`}>
                {`${name} ${surname}`}
              </MenuItem>
            )
          )}
        </Select>
        <Select
          color="warning"
          labelId="select-label-helper"
          {...register("userString")}
          sx={{ width: "100%" }}
          value={multipleSelect}
          onChange={multipleSelectChange}
          multiple
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
      </div>
      <Button type="submit" id="button-primary" variant="contained">
        Cadastrar atividade
      </Button>
    </form>
  );
}
