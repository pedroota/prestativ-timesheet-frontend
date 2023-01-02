import {
  Button,
  Select,
  TextField,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function RegisterActivity() {
  const { register, handleSubmit } = useForm({});
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const multipleSelectChange = (
    event: SelectChangeEvent<typeof multipleSelect>
  ) => {
    setMultipleSelect(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const projects = [
    {
      name: "Projeto 1",
    },
    {
      name: "Projeto 2",
    },
    {
      name: "Projeto 3",
    },
  ];

  const consultant = [
    {
      name: "Pedro",
    },
    {
      name: "Filipe",
    },
    {
      name: "Pietro",
    },
  ];

  return (
    <form className="c-register-activity" onSubmit={onSubmit}>
      <h1>Cadastrar atividade</h1>
      <TextField
        required
        color="warning"
        label="Nome da atividade"
        type="text"
        {...register("name-activity")}
      />
      <Select
        color="warning"
        labelId="select-label-helper"
        {...register("project")}
        label="Projeto relacionado"
        defaultValue=""
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {projects.map(({ name }) => (
          <MenuItem key={name} value={name}>
            {name}
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
        {...register("callNumber")}
      />
      <TextField
        required
        color="warning"
        label="Observação"
        type="text"
        {...register("obs")}
      />
      <div className="c-register-activity--input-container">
        <Select
          color="warning"
          labelId="select-label-helper"
          {...register("gestor-relacionado")}
          sx={{ width: "100%" }}
          label="Gestor de projetos relacionado"
          defaultValue=""
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {consultant.map(({ name }) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <Select
          color="warning"
          labelId="select-label-helper"
          {...register("consultor-relacionado")}
          sx={{ width: "100%" }}
          value={multipleSelect}
          onChange={multipleSelectChange}
          multiple
          label="Consultores relacionado"
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {consultant.map(({ name }) => (
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
