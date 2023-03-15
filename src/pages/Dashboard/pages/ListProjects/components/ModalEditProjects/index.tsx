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
import { getUserByRole } from "services/auth.service";
import { UserInfo, UserRegister } from "interfaces/users.interface";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getBusiness } from "services/business.service";
import { BusinessUnitModals } from "interfaces/business.interface";

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
  useQuery(["projects", currentProject], () => getProjectById(currentProject), {
    onSuccess: ({ data }) => {
      data.project.title && setTitleProject(data.project?.title);
      data.project.idClient && setCurrentClient(data.project?.idClient._id);
      data.project.valueProject && setPrice(`${data.project.valueProject}`);
      data.project.description &&
        setProjectDescription(data.project.description);
      reset(data.project);
      const gps: string[] =
        data.project.gpProject &&
        data.project.gpProject.map((element: UserInfo) => {
          return element._id;
        });
      setGpProject(gps);
      setIdBusinessUnit(
        data.project.businessUnit ? data.project.businessUnit._id : ""
      );
      console.log(data);
    },
  });
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [currentClient, setCurrentClient] = useState("");
  const [titleProject, setTitleProject] = useState("");
  const [gpProject, setGpProject] = useState<string[]>([]);
  const [projectDescription, setProjectDescription] = useState("");
  const [idBusinessUnit, setIdBusinessUnit] = useState("");
  const queryClient = useQueryClient();
  const { data: clientsList } = useQuery(["clients"], () => getClients());

  const { data: businessUnitList } = useQuery(["business"], () =>
    getBusiness()
  );

  const setNewPrice = (value: string) => {
    const stringValueWithoutDots = value.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
  };

  const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  const { mutate, isLoading } = useMutation(
    ({ title, idClient, gpProject, description }: RegisterProject) =>
      updateProjects(currentProject, {
        title,
        idClient,
        valueProject: priceNumber,
        gpProject,
        businessUnit: idBusinessUnit,
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

  const onSubmit = handleSubmit(({ valueProject, description, gpProject }) => {
    mutate({
      title: titleProject.trim(),
      idClient: currentClient,
      valueProject,
      description,
      gpProject,
      businessUnit: idBusinessUnit,
    });
    setCurrentClient("");
    setTitleProject("");
    setProjectDescription("");
    reset();
  });

  const multipleSelectGPChange = (
    event: SelectChangeEvent<typeof gpProject>
  ) => {
    setGpProject(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  return (
    <Permission roles={["EDITAR_PROJETO"]}>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Editar projeto">
        <form className="c-form-spacing" onSubmit={onSubmit}>
          <p>Informações do projeto</p>
          <TextField
            label="Nome do Projeto"
            color="warning"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={titleProject}
            onChange={(event) => setTitleProject(event.target.value)}
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
            required
            color="warning"
            variant="outlined"
            sx={{ width: "100%" }}
            label="Valor"
            type="text"
            value={currencyMask(price)}
            InputLabelProps={{ shrink: true }}
            onChange={(event) => setNewPrice(event.target.value)}
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
                {...register("gpProject")}
                sx={{ width: "100%" }} // maxWidth: "14rem"
                value={gpProject}
                onChange={multipleSelectGPChange}
                multiple
              >
                <MenuItem value="" disabled>
                  Selecione no mínimo uma opção
                </MenuItem>
                {listGps?.data.map(({ name, surname, _id }: UserRegister) => (
                  <MenuItem value={_id} key={_id}>
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
              Business Unit
              <Select
                color="warning"
                variant="outlined"
                sx={{ width: "100%" }} // maxWidth: "14rem"
                value={idBusinessUnit}
                onChange={(event) => setIdBusinessUnit(event.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione uma opção (campo opicional)
                </MenuItem>
                <MenuItem value="">
                  <p>Nenhum B.U.</p>
                </MenuItem>
                {businessUnitList?.data.map(
                  ({ _id, nameBU }: BusinessUnitModals) => (
                    <MenuItem key={_id} value={_id}>
                      {nameBU}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormLabel>
          </div>
          <TextField
            label="Descrição do Projeto"
            {...register("description")}
            InputLabelProps={{ shrink: true }}
            color="warning"
            variant="outlined"
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
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
