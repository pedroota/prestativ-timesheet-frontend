import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "components/ModalGeneral";
import { toast } from "react-toastify";
import { Permission } from "components/Permission";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ProjectsInfo } from "interfaces/projects.interface";
import { currencyMask } from "utils/masks";
import { UserRegister } from "interfaces/users.interface";
import { SwitchIOS } from "components/SwitchIOS";
import { RegisterActivity } from "interfaces/activities.interface";
import { createActivities } from "services/activities.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByRole } from "services/auth.service";
import { useForm } from "react-hook-form";
import { getProjects } from "services/project.service";
import { generateTimestampWithDateAndTime } from "utils/timeControl";

interface ModalRegisterActivityProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalRegisterActivity({
  isOpen,
  setIsOpen,
}: ModalRegisterActivityProps) {
  const queryClient = useQueryClient();
  const [nameProject, setNameProject] = useState("");
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [gpActivity, setGpActivity] = useState<string[]>([]);
  const [fieldClosedScope, setFieldClosedScope] = useState(false);
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);

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
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading } = useMutation(
    ({ title, project, gpActivity, description, users }: RegisterActivity) =>
      createActivities({
        title,
        project,
        valueActivity: priceNumber,
        gpActivity,
        description,
        users,
        closedScope: fieldClosedScope,
        activityValidity: generateTimestampWithDateAndTime(chosenDay, "00:00"),
      }),

    {
      onSuccess: () => {
        reset();
        setFieldClosedScope(false);
        setNameProject("");
        setPrice("");
        setPriceNumber(0);
        setMultipleSelect([]);
        setGpActivity([]);
        setChosenDay(oneMonthLater);
        toast.success("Atividade criada com sucesso.");
        setIsOpen((prevState) => !prevState);
        queryClient.invalidateQueries(["activities"]);
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao criar a atividade", {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({ title, project, gpActivity, description, users }) => {
      mutate({
        title,
        project,
        valueActivity: priceNumber,
        gpActivity,
        description,
        users,
        closedScope: fieldClosedScope,
        activityValidity: generateTimestampWithDateAndTime(chosenDay, "00:00"),
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

  const multipleSelectGPChange = (
    event: SelectChangeEvent<typeof gpActivity>
  ) => {
    setGpActivity(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    const stringValueWithoutDots = stringValue.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Cadastrar atividade">
      <Permission roles={["CADASTRO_ATIVIDADE"]}>
        <form className="c-register-activity" onSubmit={onSubmit}>
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
            <FormLabel
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              }}
            >
              Gerentes De Projetos (Selecione no mínimo uma opção)
              <Select
                color="warning"
                variant="outlined"
                {...register("gpActivity")}
                sx={{ width: "100%" }} // maxWidth: "14rem"
                value={gpActivity}
                onChange={multipleSelectGPChange}
                multiple
              >
                <MenuItem value="" disabled>
                  Selecione no mínimo uma opção
                </MenuItem>
                {GPList?.data.map(({ name, surname, _id }: UserRegister) => (
                  <MenuItem key={_id} value={_id}>
                    {`${name} ${surname}`}
                  </MenuItem>
                ))}
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
    </Modal>
  );
}
