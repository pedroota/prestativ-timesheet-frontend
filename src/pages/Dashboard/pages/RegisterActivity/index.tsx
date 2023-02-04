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
import { ProjectsInfo } from "interfaces/projects.interface";
import { UserRegister } from "interfaces/users.interface";
import { toast } from "react-toastify";
import { Activities } from "interfaces/activities.interface";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Permission } from "components/Permission";

export function RegisterActivity() {
  const { data: projectList } = useQuery(["client-project"], () =>
    getProjects()
  );
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );
  const { data: consultantList } = useQuery(
    ["user-consultant", "Consultor"],
    () => getUserByRole("consultor")
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
      users,
      closedScope,
    }) => {
      createActivities({
        title,
        project,
        valueActivity,
        gpActivity,
        description,
        users,
        closedScope,
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
    <Permission roles={["CADASTRO_ATIVIDADE"]}>
      <form className="c-register-activity" onSubmit={onSubmit}>
        <h1>Cadastrar atividade</h1>
        <TextField
          required
          color="warning"
          label="Nome da atividade"
          type="text"
          {...register("title")}
        />
        <TextField
          color="warning"
          {...register("project")}
          select
          label="Projeto"
          defaultValue=""
        >
          <MenuItem selected disabled value="">
            Projeto - Selecione uma opção
          </MenuItem>
          {projectList?.data.map(({ title, _id, idClient }: ProjectsInfo) => (
            <MenuItem key={_id} value={_id}>
              {`${title} (Cliente: ${idClient.name})`}
            </MenuItem>
          ))}
        </TextField>
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
          <TextField
            color="warning"
            {...register("gpActivity")}
            sx={{ width: "100%" }}
            select
            label="Gerente de projetos"
            defaultValue=""
          >
            <MenuItem selected disabled value="">
              GP - Selecione uma opção
            </MenuItem>
            {GPList?.data.map(({ name, surname, _id }: UserRegister) => (
              <MenuItem key={_id} value={_id}>
                {`${name} ${surname}`}
              </MenuItem>
            ))}
          </TextField>
          <Select
            color="warning"
            variant="outlined"
            {...register("users")}
            sx={{ width: "100%" }}
            value={multipleSelect}
            onChange={multipleSelectChange}
            multiple
          >
            <MenuItem value="" disabled>
              Selecione uma opção
            </MenuItem>
            {consultantList?.data.map(
              ({ name, surname, _id }: UserRegister) => (
                <MenuItem key={_id} value={_id}>
                  {`${name} ${surname}`}
                </MenuItem>
              )
            )}
          </Select>
          <FormControlLabel
            control={<Checkbox {...register("closedScope")} />}
            label="Escopo Fechado"
          />
        </div>
        <Button type="submit" id="button-primary" variant="contained">
          Cadastrar atividade
        </Button>
      </form>
    </Permission>
  );
}
