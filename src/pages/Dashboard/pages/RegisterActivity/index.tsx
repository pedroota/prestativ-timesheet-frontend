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

export function RegisterActivity() {
  const { data: projectList } = useQuery(["client-project", "project"], () =>
    getProjects()
  );
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  const { data: consultantList } = useQuery(
    ["user-consultant", "Consultor"],
    () => getUserByRole("Consultor")
  );
  const { register, handleSubmit, reset } = useForm({});
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
      }).then(() => {
        reset();
      });
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
        label="Número do chamado"
        type="text"
        {...register("callNumber")}
      />
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
          {GPList?.data.map(({ name }: UserRegister) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
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
          {consultantList?.data.map(({ name }: UserRegister) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Button type="submit" id="button-primary" variant="contained">
        Cadastrar atividade
      </Button>
    </form>
  );
}
