import {
  Button,
  Select,
  TextField,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProjects } from "services/project.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getUserByRole } from "services/auth.service";
import { createActivities } from "services/activities.service";
import { ProjectsInfo } from "interfaces/projects.interface";
import { UserRegister } from "interfaces/users.interface";
import { toast } from "react-toastify";
import { Activities } from "interfaces/activities.interface";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Permission } from "components/Permission";
import { currencyMask } from "utils/masks";
import { SwitchIOS } from "components/SwitchIOS";
import FormLabel from "@mui/material/FormLabel/FormLabel";

export function RegisterActivity() {
  const [gpActivity, setGpActivity] = useState("");
  const [nameProject, setNameProject] = useState("");
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [fieldClosedScope, setFieldClosedScope] = useState(false);
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);

  const { data: projectList } = useQuery(["client-project"], () =>
    getProjects()
  );
  const { data: GPList } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  function findGpId() {
    setGpActivity(GPList?.data[0]._id);
  }

  const { data: consultantList } = useQuery(
    ["user-consultant", "Consultor"],
    () => getUserByRole("consultor")
  );
  const { register, handleSubmit, reset } = useForm<Activities>({});

  const { mutate, isLoading } = useMutation(
    ({
      title,
      project,
      gpActivity,
      description,
      users,
      closedScope,
      activityValidity,
    }: Activities) =>
      createActivities({
        title,
        project,
        valueActivity: priceNumber,
        gpActivity,
        description,
        users,
        closedScope,
        activityValidity,
      }),
    {
      onSuccess: () => {
        reset();
        setFieldClosedScope(false);
        setGpActivity("");
        setNameProject("");
        setPrice("");
        setPriceNumber(0);
        setMultipleSelect([]);
        setChosenDay(oneMonthLater);
        toast.success("Atividade criada com sucesso.");
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao criar a atividade", {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({
      title,
      project,
      gpActivity,
      description,
      users,
      closedScope,
      activityValidity,
    }) => {
      findGpId();
      mutate({
        title,
        project,
        valueActivity: priceNumber,
        gpActivity,
        description,
        users,
        closedScope,
        activityValidity,
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

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    setPrice(stringValue);
    setPriceNumber(Number(stringValue.slice(2)));
  };

  // Validade Data
  function oneMonthLater() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  }

  const [chosenDay, setChosenDay] = useState(oneMonthLater);

  const setDay = (e: { target: { value: string } }) => {
    setChosenDay(e.target.value);
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
          value={nameProject}
          onChange={(event) => setNameProject(event.target.value)}
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
          color="warning"
          label="Valor da atividade"
          type="text"
          value={price && currencyMask(price)}
          {...register("valueActivity")}
          onChange={(event) => setNewPrice(event)}
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
            sx={{ width: "100%", display: "none" }}
            select
            label="Gerente de projetos"
            value={gpActivity}
            onChange={(event) => setGpActivity(event.target.value)}
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
          <FormLabel
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            Consultores (Selecione no mínimo uma opção)
            <Select
              color="warning"
              variant="outlined"
              {...register("users")}
              sx={{ width: "100%" }} // maxWidth: "14rem"
              value={multipleSelect}
              onChange={multipleSelectChange}
              multiple
            >
              <MenuItem value="" disabled>
                Selecione no mínimo uma opção
              </MenuItem>
              {consultantList?.data.map(
                ({ name, surname, _id }: UserRegister) => (
                  <MenuItem key={_id} value={_id}>
                    {`${name} ${surname}`}
                  </MenuItem>
                )
              )}
            </Select>
          </FormLabel>
        </div>
        <div className="c-register-activity--input-container">
          <FormLabel
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            Validade da Atividade
            <TextField
              type="date"
              color="warning"
              variant="outlined"
              required
              value={chosenDay}
              {...register("activityValidity")}
              onChange={setDay}
              sx={{
                marginRight: "2rem",
              }}
            />
          </FormLabel>
          <FormControlLabel
            control={
              <SwitchIOS
                value={fieldClosedScope}
                {...register("closedScope")}
                onChange={() => setFieldClosedScope(!fieldClosedScope)}
              />
            }
            label="Escopo Fechado"
          />
        </div>
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
  );
}
