import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import {
  createHours,
  deleteHours,
  getHoursFilters,
  updateHours,
} from "services/hours.service";
import {
  Paper,
  Typography,
  Tooltip,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import BrushIcon from "@mui/icons-material/Brush";
import { Hours } from "interfaces/hours.interface";

import * as XLSX from "xlsx";

// Utils
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateTotalHoursWithAdjustment,
  generateTimestampWithDateAndTime,
  convertDate,
  generateMilisecondsWithHoursAndMinutes,
  generateTotalWithAdjustment,
} from "utils/timeControl";
import { Permission } from "components/Permission";
import { currencyMask } from "utils/masks";
import { useAuthStore } from "stores/userStore";

import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";

import { HotColumn, HotTable } from "@handsontable/react";
import { getClients } from "services/clients.service";
import { ModalConfirmChanges } from "./components/ModalConfirmChanges";
import moment from "moment";

registerAllModules();

export function Timesheet() {
  const { user } = useAuthStore((state: any) => state);
  const queryClient = useQueryClient();

  const { data: hours, isLoading: isLoadingHours } = useQuery(["hours"], () =>
    getHoursFilters("")
  );

  setTimeout(() => {
    hoursDataGrid && setHaveData(true);
  }, 200);

  const { data: clients, isLoading: loadingClients } = useQuery(
    ["clients"],
    () => getClients()
  );

  const getClientData = () => {
    const client = clients?.data?.find(
      (client: { name: string }) => client.name === actualClient
    );
    return client.projects;
  };

  const getProjectData = () => {
    const project = getClientData()?.find(
      (project: { title: string }) => project.title === actualProject
    );
    return project.activities;
  };

  const clientListNames = clients?.data?.map(
    (client: { name: string }) => client.name
  );

  const [projectListNames, setProjectListNames] = useState([]);
  const [activityListNames, setActivityListNames] = useState([]);

  const { data: hoursByUser, isLoading: isLoadingHoursByUser } = useQuery(
    ["hours", user._id],
    () => getHoursFilters("relUser=" + user._id)
  );

  const hottable: any = useRef(null);

  const generateUserPermissions = () => {
    const arrayPermissions = [];
    if (!user.role.permissions.includes("DATA")) {
      arrayPermissions.push(1);
    }
    if (!user.role.permissions.includes("DIA_DA_SEMANA")) {
      arrayPermissions.push(2);
    }
    if (!user.role.permissions.includes("HORA_INICIAL")) {
      arrayPermissions.push(3);
    }
    if (!user.role.permissions.includes("HORA_FINAL")) {
      arrayPermissions.push(4);
    }
    if (!user.role.permissions.includes("TOTAL")) {
      arrayPermissions.push(5);
    }
    if (!user.role.permissions.includes("AJUSTE")) {
      arrayPermissions.push(6);
    }
    if (!user.role.permissions.includes("TOTAL_COM_AJUSTE")) {
      arrayPermissions.push(7);
    }
    if (!user.role.permissions.includes("CLIENTE")) {
      arrayPermissions.push(8);
    }
    if (!user.role.permissions.includes("PROJETO")) {
      arrayPermissions.push(9);
    }
    if (!user.role.permissions.includes("ATIVIDADE")) {
      arrayPermissions.push(10);
    }
    if (!user.role.permissions.includes("DESCRICAO_DA_ATIVIDADE")) {
      arrayPermissions.push(11);
    }
    if (!user.role.permissions.includes("VALOR")) {
      arrayPermissions.push(12);
    }
    if (!user.role.permissions.includes("GERENTE_DE_PROJETOS")) {
      arrayPermissions.push(13);
    }
    if (!user.role.permissions.includes("CONSULTOR")) {
      arrayPermissions.push(14);
    }
    if (!user.role.permissions.includes("ESCOPO_FECHADO")) {
      arrayPermissions.push(15);
    }
    if (!user.role.permissions.includes("APROVADO_GP")) {
      arrayPermissions.push(16);
    }
    if (!user.role.permissions.includes("FATURAVEL")) {
      arrayPermissions.push(17);
    }
    if (!user.role.permissions.includes("LANCADO")) {
      arrayPermissions.push(18);
    }
    if (!user.role.permissions.includes("APROVADO")) {
      arrayPermissions.push(19);
    }
    if (!user.role.permissions.includes("CHAMADO_LANCADO")) {
      arrayPermissions.push(20);
    }
    if (!user.role.permissions.includes("DATA_SISTEMA_DATA_EDICAO")) {
      arrayPermissions.push(21);
      arrayPermissions.push(22);
    }
    return arrayPermissions;
  };

  // usado para o deletamento de multiplos dados
  const [selectedId, setSelectedId] = useState("");
  const [selectedRow, setSelectedRow] = useState(0);

  type Changes = {
    id: string;
    initial?: number;
    final?: number;
    adjustment?: number;
    relActivity?: string;
    relProject?: string;
    relClient?: string;
    relUser?: string;
    approvedGP?: boolean;
    billable?: boolean;
    released?: boolean;
    approved?: boolean;
    activityDesc?: string;
    releasedCall?: string;
  };

  const [changes, setChanges] = useState<Changes[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = () => {
    setIsOpen(false);
  };

  function removeDuplicates(array: string[]) {
    return [...new Set(array)];
  }

  function findClientByName(name: string) {
    return clients?.data?.find(
      (client: { name: string }) => client.name === name
    );
  }

  function findProjectByName(client: any, name: string) {
    return client.projects.find((project: any) => project.title === name);
  }

  function findActivityByName(project: any, name: string) {
    return project.activities.find((activity: any) => activity.title === name);
  }

  const processDataForCreation = (array: any[]) => {
    const resultArray = [];

    for (let i = 0; i < array.length; i++) {
      const [
        _id,
        date,
        _dayOfWeek,
        startTime,
        endTime,
        _total,
        adjustment,
        _totalwithAdjust,
        rClient,
        rProject,
        rActivity,
        description,
        _value,
        _projectManager,
        consultant,
        _closedScope,
        approvedGpm,
        billablem,
        releasedm,
        approvedADMm,
        releasedCall,
        _createdOn,
        _modifiedOn,
      ] = array[i];

      const convertedDate = convertDate(date);

      let initialTimestamp = null;
      if (date && startTime) {
        initialTimestamp = generateTimestampWithDateAndTime(
          convertedDate,
          startTime
        );
      }

      let finalTimestamp = null;
      if (date && endTime) {
        finalTimestamp = generateTimestampWithDateAndTime(
          convertedDate,
          endTime
        );
      }

      let adjustmentValue = null;
      if (adjustment) {
        adjustmentValue = generateMilisecondsWithHoursAndMinutes(adjustment);
      }

      let relClient = null;
      let relProject = null;
      let relActivity = null;

      if (rClient) {
        const clientFind = findClientByName(rClient);
        if (clientFind) {
          relClient = clientFind?._id;
          if (rProject) {
            const projectFind = findProjectByName(clientFind, rProject);
            if (projectFind) {
              relProject = projectFind?._id;
              if (rActivity) {
                const activityFind = findActivityByName(projectFind, rActivity);
                if (activityFind) {
                  relActivity = activityFind?._id;
                }
              }
            }
          }
        }
      }

      let desc = null;
      if (description) {
        desc = description;
      }

      let approvedGpCheck = null;
      let billableCheck = null;
      let releasedCheck = null;
      let approvedADMCheck = null;

      if (approvedGpm == true || false) {
        approvedGpCheck = approvedGpm;
      }
      if (billablem == true || false) {
        billableCheck = billablem;
      }
      if (releasedm == true || false) {
        releasedCheck = releasedm;
      }
      if (approvedADMm == true || false) {
        approvedADMCheck = approvedADMm;
      }

      let relCall = null;
      if (releasedCall) {
        relCall = releasedCall;
      }

      let rUser = null;
      if (consultant) {
        rUser = user._id;
      }

      const obj = {
        ...(initialTimestamp && { initial: initialTimestamp }),
        ...(finalTimestamp && { final: finalTimestamp }),
        ...(adjustmentValue && { adjustment: adjustmentValue }),
        ...(relClient && { relClient: relClient }),
        ...(relProject && { relProject: relProject }),
        ...(relActivity && { relActivity: relActivity }),
        ...(rUser && { relUser: rUser }),
        ...(approvedGpCheck !== null && { approvedGP: approvedGpCheck }),
        ...(billableCheck !== null && { billable: billableCheck }),
        ...(releasedCheck !== null && { released: releasedCheck }),
        ...(approvedADMCheck !== null && { approved: approvedADMCheck }),
        ...(desc && { activityDesc: desc }),
        ...(relCall && { releasedCall: relCall }),
      };

      resultArray.push(obj);
    }

    return resultArray;
  };

  const handleConfirm = async () => {
    // efetuar os deletamentos no banco
    const arrayOfIdsForDelete = idsSelectedForDelete.filter((value) => {
      if (value === null) {
        setNumberOfNewReleases(numberOfNewReleases - 1);
        return false;
      }
      return true;
    });
    if (arrayOfIdsForDelete.length > 0) {
      for (let i = 0; i < arrayOfIdsForDelete.length; i++) {
        await deleteHours(arrayOfIdsForDelete[i]);
      }
      setIdsSelectedForDelete([]);
    }
    // Salvar Edições
    const filteredChanges = changes.filter((change) => {
      return change.id !== null && Object.keys(change).length > 1;
    });
    if (filteredChanges) {
      for (const { id, ...data } of filteredChanges) {
        await updateHours(id as string, { ...data });
      }
      setChanges([]);
    }
    // Salvar Criações
    if (numberOfNewReleases !== 0) {
      const arrayOfCreations = hoursDataGridData.filter(
        (arrayInside: any[]) => arrayInside[0] === null
      );
      const arrayForDB = processDataForCreation(arrayOfCreations);

      for (const { ...data } of arrayForDB) {
        await createHours({ ...data });
      }
      setNumberOfNewReleases(0);
    }

    setIsOpen(false);
    queryClient.invalidateQueries(["hours"]);
    // setHoursDataGridData(hoursDataGridData);
    // setTimeout(() => {
    // }, 2000);
  };

  const [numberOfNewReleases, setNumberOfNewReleases] = useState(0);

  const handleUpdatedChanges = (
    idChanged: string,
    index: number,
    collumnChanged: string | number,
    newValue: string | number | boolean
  ) => {
    // caso não tenha valor de dia inicial ele preencherá o dia da semana só com a data
    if (!idChanged) {
      if (collumnChanged == 1) {
        const date = convertDate(newValue as string);
        hoursDataGridData[index][2] = generateDayWeekWithTimestamp(
          generateTimestampWithDateAndTime(date, "15:00")
        );
      }
    }

    const updatingId = changes.find((o) => o.id === idChanged);
    const newChanges = [...changes]; // cria uma cópia do array de changes

    if (!updatingId) {
      newChanges.push({ id: idChanged });
    }

    // Alterando Data
    if (collumnChanged == 1) {
      const initialHour = hoursDataGridData[index][3];
      const finalHour = hoursDataGridData[index][4];
      const date = convertDate(newValue as string);

      if (initialHour.length > 4) {
        const updatingId = newChanges.find((o) => o.id === idChanged);
        if (updatingId) {
          updatingId.initial = generateTimestampWithDateAndTime(
            date,
            initialHour
          );
        }
      }

      if (finalHour.length > 4) {
        const updatingId = newChanges.find((o) => o.id === idChanged);
        if (updatingId) {
          updatingId.final = generateTimestampWithDateAndTime(date, finalHour);
        }
      }

      // altera o valor que está no DIA ATUAL (SEG / TER / QUA)
      hoursDataGridData[index][2] = generateDayWeekWithTimestamp(
        generateTimestampWithDateAndTime(date, initialHour)
      );
      setHoursDataGridData(hoursDataGridData);
    }

    if (collumnChanged === 3 || collumnChanged === 4 || collumnChanged === 6) {
      const insertedValue = newValue as string;
      const regex = /^\d{2}:\d{2}$/; // expressão regular para o formato HH:mm
      if (!regex.test(insertedValue)) {
        const formattedValue = moment(insertedValue, "HHmm").format("HH:mm");
        hottable.current.hotInstance.setDataAtCell(
          index,
          collumnChanged,
          formattedValue
        );
      }

      // Alterando Inicio
      if (collumnChanged == 3) {
        const initialHour = newValue as string;
        const date = convertDate(hoursDataGridData[index][1]);

        if (initialHour.length > 4) {
          const updatingId = newChanges.find((o) => o.id === idChanged);
          if (updatingId) {
            updatingId.initial = generateTimestampWithDateAndTime(
              date,
              initialHour
            );
          }
        }

        const finalHour: string = hoursDataGridData[index][4];
        if (finalHour.length > 4) {
          // altera o valor que está no TOTAL
          hoursDataGridData[index][5] = generateTotalHours(
            generateTimestampWithDateAndTime(date, initialHour),
            generateTimestampWithDateAndTime(date, finalHour)
          );
          setHoursDataGridData(hoursDataGridData);
        }
      }
      // Alterando Final
      if (collumnChanged == 4) {
        const finalHour = newValue as string;
        const date = convertDate(hoursDataGridData[index][1]);

        if (finalHour.length > 4) {
          // altera o valor que está no TOTAL
          const updatingId = newChanges.find((o) => o.id === idChanged);
          if (updatingId) {
            updatingId.final = generateTimestampWithDateAndTime(
              date,
              finalHour
            );
          }
        }

        const initialHour: string = hoursDataGridData[index][3];
        if (initialHour.length > 4) {
          hoursDataGridData[index][5] = generateTotalHours(
            generateTimestampWithDateAndTime(date, initialHour),
            generateTimestampWithDateAndTime(date, finalHour)
          );
          setHoursDataGridData(hoursDataGridData);
        }
      }
      // Alterando Ajuste
      if (collumnChanged == 6) {
        const adjustment = newValue as string;
        const total = hoursDataGridData[index][5];
        const updatingId = newChanges.find((o) => o.id === idChanged);
        if (updatingId) {
          updatingId.adjustment =
            generateMilisecondsWithHoursAndMinutes(adjustment);
        }
        // atualizando TOTAL COM AJUSTE
        hoursDataGridData[index][7] = generateTotalWithAdjustment(
          total,
          adjustment
        );
      }
    }

    // Alterando Cliente
    if (collumnChanged == 8) {
      const nameOfClient = newValue as string;
      const getClientIdByName = (nameOfClient: string) => {
        const client = clients?.data?.find(
          (client: { name: string }) => client.name === nameOfClient
        );
        return client?._id;
      };
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.relClient = getClientIdByName(nameOfClient);
      }
    }
    // Alterando Projeto
    if (collumnChanged == 9) {
      const nameOfProject = newValue as string;
      const nameOfClient = hoursDataGridData[index][8];
      const getProjectIdByName = () => {
        const client = clients?.data?.find(
          (client: any) => client.name === nameOfClient
        );
        if (client) {
          const project = client.projects.find(
            (project: any) => project.title === nameOfProject
          );
          if (project) {
            return project._id;
          }
        }
        return null;
      };
      // console.log(getProjectIdByName());
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.relProject = getProjectIdByName();
      }
    }
    // Alterando Atividade
    if (collumnChanged == 10) {
      const nameOfActivity = newValue as string;
      const nameOfProject = hoursDataGridData[index][9];
      const nameOfClient = hoursDataGridData[index][8];
      const getProjectIdByName = () => {
        const client = clients?.data?.find(
          (client: any) => client.name === nameOfClient
        );
        if (client) {
          const project = client.projects.find(
            (project: any) => project.title === nameOfProject
          );
          if (project) {
            const activity = project.activities.find(
              (activity: any) => activity.title === nameOfActivity
            );
            if (activity) {
              return activity._id;
            }
          }
        }
        return null;
      };
      // console.log(getProjectIdByName());
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.relActivity = getProjectIdByName();
      }
    }
    // Alterando Descrição
    if (collumnChanged == 11) {
      const description = newValue as string;
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.activityDesc = description;
      }
    }
    // Alterando Aprovado Gp
    if (collumnChanged == 16) {
      const value = newValue as boolean;
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.approvedGP = value;
      }
    }
    // Alterando Faturável
    if (collumnChanged == 17) {
      const value = newValue as boolean;
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.billable = value;
      }
    }
    // Alterando Lançado
    if (collumnChanged == 18) {
      const value = newValue as boolean;
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.released = value;
      }
    }
    // Alterando Aprovado ADM
    if (collumnChanged == 19) {
      const value = newValue as boolean;
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.approved = value;
      }
    }
    // Alterando Chamado Lançado
    if (collumnChanged == 20) {
      const releasedCall = newValue as string;
      const updatingId = newChanges.find((o) => o.id === idChanged);
      if (updatingId) {
        updatingId.releasedCall = releasedCall;
      }
    }

    setChanges(newChanges);
  };

  const [actualClient, setActualClient] = useState("");
  const [actualProject, setActualProject] = useState("");

  const hourxToExcel = hours?.data.map(
    ({
      initial,
      final,
      adjustment,
      relClient,
      relProject,
      relActivity,
      relUser,
      approvedGP,
      billable,
      released,
      approved,
      releasedCall,
      activityDesc,
      createdAt,
      updatedAt,
    }: Hours) => {
      return new Object({
        Data: generateDateWithTimestamp(initial) || " ",
        DiaSemana: generateDayWeekWithTimestamp(initial) || " ",
        HoraInicial: generateTimeWithTimestamp(initial) || " ",
        HoraFinal: generateTimeWithTimestamp(final) || " ",
        Total: generateTotalHours(initial, final) || " ",
        Ajuste: generateAdjustmentWithNumberInMilliseconds(adjustment) || " ",
        TotalAjuste:
          generateTotalHoursWithAdjustment(initial, final, adjustment) || " ",
        Cliente: relClient?.name || " ",
        Projeto: relProject?.title || " ",
        Atividade: relActivity?.title || " ",
        DescricaoAtividade: activityDesc || " ",
        Valor:
          relActivity && relProject && relClient
            ? Number(
                (relActivity.valueActivity
                  ? relActivity.valueActivity
                  : relProject.valueProject
                  ? relProject.valueProject
                  : relClient.valueClient
                ).toString()
              )
            : " ",
        GerenteProjetos:
          relActivity && relProject && relClient
            ? relActivity.gpActivity.length
              ? relActivity.gpActivity
                  .map(({ name, surname }) => `${name} ${surname}`)
                  .join(", ")
              : relProject.gpProject && relProject.gpProject.length
              ? relProject.gpProject.reduce(
                  (accumulator, { name, surname }) =>
                    `${accumulator}${
                      accumulator.length > 0 ? ", " : " "
                    }${name} ${surname}`,
                  " "
                )
              : relClient.gpClient && relClient.gpClient.length
              ? relClient.gpClient
                  .map(({ name, surname }) => `${name} ${surname}`)
                  .join(", ")
              : " "
            : " ",
        Consultor: `${relUser?.name} ${relUser?.surname}` || " ",
        EscopoFechado: relActivity?.closedScope ? "sim" : "não",
        AprovadoGP: approvedGP ? "sim" : "não",
        Faturável: billable ? "sim" : "não",
        Lançado: released ? "sim" : "não",
        Aprovado: approved ? "sim" : "não",
        ChamadoLancado: releasedCall ? releasedCall : " ",
        DataCriacao: `${generateDateWithTimestamp(
          createdAt
        )} ${generateTimeWithTimestamp(createdAt)}`,
        DataEdicao: `${generateDateWithTimestamp(
          updatedAt
        )} ${generateTimeWithTimestamp(updatedAt)}`,
      });
    }
  );

  const handleTransformExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(hourxToExcel);
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");
    XLSX.writeFile(wb, "TimesheetExcel.xlsx");
  };

  const [idsSelectedForDelete, setIdsSelectedForDelete] = useState<string[]>(
    []
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const validateUserRegisterHours = () => {
    if (user.typeField !== "nenhum" && hoursByUser?.data?.length) {
      return hoursByUser;
    }
    if (hours?.data?.length) {
      return hours;
    }
    return null;
  };

  const hoursDataGrid = validateUserRegisterHours()?.data.map(
    ({
      _id,
      initial,
      final,
      adjustment,
      relClient,
      relProject,
      relActivity,
      relUser,
      approvedGP,
      billable,
      released,
      approved,
      releasedCall,
      activityDesc,
      createdAt,
      updatedAt,
    }: Hours) => {
      return [
        _id || " ",
        generateDateWithTimestamp(initial) || " ",
        generateDayWeekWithTimestamp(initial) || " ",
        generateTimeWithTimestamp(initial) || " ",
        final ? generateTimeWithTimestamp(final) : " ",
        initial && final ? generateTotalHours(initial, final) : " ",
        generateAdjustmentWithNumberInMilliseconds(adjustment) || " ",
        adjustment
          ? generateTotalHoursWithAdjustment(initial, final, adjustment)
          : initial && final
          ? generateTotalHours(initial, final)
          : " ",
        relClient ? relClient?.name : " ",
        relProject ? relProject?.title : " ",
        relActivity ? relActivity?.title : " ",
        activityDesc || " ",
        relActivity && relProject && relClient
          ? currencyMask(
              (relActivity?.valueActivity
                ? relActivity.valueActivity
                : relProject.valueProject
                ? relProject.valueProject
                : relClient.valueClient
              ).toString()
            )
          : " ",
        relActivity && relProject && relClient
          ? relActivity.gpActivity
            ? relActivity.gpActivity
                .map(({ name, surname }) => `${name} ${surname}`)
                .join(", ")
            : relProject.gpProject && relProject.gpProject
            ? relProject.gpProject
                .map(({ name, surname }) => `${name} ${surname}`)
                .join(", ")
            : relClient.gpClient && relClient.gpClient
            ? relClient.gpClient
                .map(({ name, surname }) => `${name} ${surname}`)
                .join(", ")
            : " "
          : " ",
        `${relUser?.name} ${relUser?.surname}` || " ",
        relActivity ? relActivity.closedScope : " ",
        approvedGP,
        billable,
        released,
        approved,
        releasedCall || " ",
        `${generateDateWithTimestamp(createdAt)} ${generateTimeWithTimestamp(
          createdAt
        )}`,
        `${generateDateWithTimestamp(updatedAt)} ${generateTimeWithTimestamp(
          updatedAt
        )}`,
      ];
    }
  );

  const [hoursDataGridData, setHoursDataGridData] = useState(hoursDataGrid);

  const hotSettings = {
    data: hoursDataGridData,
    filters: true,
    dropdownMenu: true,
    rowHeaders: true,
    persistentState: true,
    autoSave: true, // habilita a função de autosave
  };

  useEffect(() => {
    if (hottable.current) {
      hottable.current.hotInstance.updateSettings({
        time_24h: true, // define o formato de exibição padrão do horário como 24 horas
      });
    }
  }, [hottable]);

  const [haveData, setHaveData] = useState(false);

  useEffect(() => {
    queryClient.invalidateQueries(["hours"]);
    setHoursDataGridData(hoursDataGrid);
  }, [haveData]);

  return (
    <div>
      <Box
        className="mobile"
        sx={{
          width: "90vw",
          overflowX: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
          Timesheet
        </Typography>
      </Box>
      {isLoadingHours || isLoadingHoursByUser ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBlock: "4rem",
          }}
        >
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <>
          <div className="buttons-container">
            <Permission roles={["EXPORTAR_EXCEL"]}>
              <div className="buttons-export">
                <Tooltip
                  title="Exporte os dados para XLSX"
                  arrow
                  placement="top"
                >
                  <button
                    className="excelbutton"
                    onClick={handleTransformExcel}
                  >
                    Export XLSX
                  </button>
                </Tooltip>
                <Tooltip
                  title="Exporte os dados para CSV"
                  arrow
                  placement="top"
                >
                  <div className="csvbutton">
                    <CSVLink data={hourxToExcel}>Export CSV</CSVLink>
                  </div>
                </Tooltip>
              </div>
            </Permission>
            <div className="button-hours">
              <Permission roles={["DELETAR_HORAS"]}>
                <Tooltip
                  title="Selecione a inha inteira para deletar"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={() => {
                      const arrayforDelete = selectedRows.sort(
                        (a, b) => Number(b) - Number(a)
                      );

                      const arrayOfRows = arrayforDelete.map((str) =>
                        Number(str)
                      );

                      const selectedIds = selectedRows.map(
                        (index) => hoursDataGridData[Number(index)][0]
                      );

                      arrayOfRows.forEach((num) => {
                        hottable.current.hotInstance.alter("remove_row", num);
                      });

                      setIdsSelectedForDelete([
                        ...idsSelectedForDelete,
                        ...selectedIds,
                      ]);
                      setSelectedRows([]);

                      // if (
                      //   hoursDataGridData[selectedRow][16] ||
                      //   hoursDataGridData[selectedRow][17] ||
                      //   hoursDataGridData[selectedRow][18] ||
                      //   hoursDataGridData[selectedRow][19]
                      // ) {
                      //   console.log("esse lançamento não pode ser deletado");
                      // } else {
                      //   console.log("esse lançamento pode ser deletado");
                      // }
                    }}
                  >
                    Deletar
                  </button>
                </Tooltip>
              </Permission>
              <Permission roles={["LANCAR_HORAS"]}>
                <Tooltip
                  title="Insere uma linha no topo para fazer um lançamento"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={async () => {
                      hottable.current.hotInstance.alter("insert_row_above", 0);
                      hottable.current.hotInstance.setDataAtCell(
                        0,
                        14,
                        `${user.name} ${user.surname}`
                      );
                      hottable.current.hotInstance.setDataAtCell(
                        0,
                        21,
                        `${generateDateWithTimestamp(
                          Date.now()
                        )} ${generateTimeWithTimestamp(Date.now())}`
                      );
                      setNumberOfNewReleases(numberOfNewReleases + 1);
                    }}
                  >
                    Criar
                  </button>
                </Tooltip>
              </Permission>
              <Permission
                roles={["EDITAR_HORAS" || "LANCAR_HORAS"] || "DELETAR_HORAS"}
              >
                <Tooltip
                  title="Salvar todos os dados que foram modificados"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={async () => {
                      setIsOpen(true);
                    }}
                  >
                    Salvar
                  </button>
                </Tooltip>
              </Permission>
              <Permission roles={["DEVELOPER"]}>
                <Tooltip
                  title="Esse botão será deletado, utilizado apenas em ambiente dev"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={async () => {
                      console.log("modificações que serão enviadas no banco:");
                      console.log(changes);
                      console.log(numberOfNewReleases);
                      console.log(hoursDataGridData);
                      console.log(idsSelectedForDelete);
                      console.log(user);
                      console.log(clients);
                    }}
                  >
                    DEV verEdições
                  </button>
                </Tooltip>
              </Permission>
            </div>
          </div>

          <Paper className="c-timesheet" style={{ boxShadow: "none" }}>
            <HotTable
              settings={hotSettings}
              ref={hottable}
              height="70vh"
              width="100%"
              // mergeCells={}
              hiddenColumns={{
                indicators: false,
                // columns: [0], esconde o ID
                columns: [...generateUserPermissions()],
              }}
              afterSelection={(
                row,
                column,
                _row2,
                _column2,
                _preventScrolling,
                _selectionLayerLevel
              ) => {
                const getRange =
                  hottable.current.hotInstance.getSelectedRange();
                console.log(getRange);

                if (getRange.length === 1) {
                  // só aceita um range por vez
                  const range = getRange[0];
                  if (
                    range.from.col === -1 &&
                    range.to.col === hoursDataGridData[0].length - 1
                  ) {
                    // verifica se é uma linha completa
                    const selectedRowsSet = new Set(selectedRows); // cria um novo Set para atualizar o estado
                    for (let i = range.from.row; i <= range.to.row; i++) {
                      selectedRowsSet.add(i);
                    }
                    setSelectedRows([...selectedRowsSet]); // atualiza o estado
                  }
                }

                // aqui fica a parte que seleciona o projeto e a atividade de acordo com o cliente
                if (column === 9) {
                  setActualClient(hoursDataGridData[row][8]);
                  const clientData = getClientData();
                  setProjectListNames(
                    clientData?.map(
                      (project: { title: string }) => project.title
                    ) || []
                  );
                } else if (column === 10) {
                  setActualClient(hoursDataGridData[row][8]);
                  setActualProject(hoursDataGridData[row][9]);
                  const projectData = getProjectData();
                  const userLevel = user.typeField;
                  const currentUserId = user._id;
                  const today = Date.now();
                  const activities = projectData?.map(
                    (activity: {
                      title: string;
                      users?: string[];
                      activityValidity: number;
                    }) => activity
                  );
                  let activeActivities = activities.filter(
                    (activity: {
                      activityValidity: number;
                      users?: string[];
                    }) => activity.activityValidity > today
                  );
                  if (userLevel !== "nenhum") {
                    activeActivities = activeActivities.filter(
                      (activity: { users: string[] }) =>
                        activity.users?.includes(currentUserId)
                    );
                  }
                  setActivityListNames(
                    activeActivities?.map(
                      (activity: { title: any }) => activity.title
                    ) || []
                  );
                }
                setSelectedId(hoursDataGridData[row][0]);
                setSelectedRow(row);
              }}
              afterChange={(changes, source) => {
                // hook que é ativado sempre que uma edição é finalizada, isso será disparado sempre que clicar em outra celula depois de ter editado, ou ao pressionar Enter:
                // if (source === "edit") {
                //   const savedData = JSON.parse(
                //     localStorage.getItem("myTableData") || "[]"
                //   );
                //   changes?.forEach(([row, prop, oldValue, newValue]) => {
                //     savedData[row] = savedData[row] || {};
                //     savedData[row][prop] = newValue;
                //   });
                //   localStorage.setItem(
                //     "myTableData",
                //     JSON.stringify(savedData)
                //   );
                // }
                if (!changes) return;
                const idChanged = hoursDataGridData[changes[0][0]][0];
                const index = changes[0][0];
                const collumnChanged = changes[0][1];
                const newValue = changes[0][3];
                handleUpdatedChanges(
                  idChanged,
                  index,
                  collumnChanged,
                  newValue
                );
              }}
              // beforeInit={() => {
              //   // verificação dos dados no localstorage, talvez seja o causador do bug na inicialização
              //   const savedData = JSON.parse(
              //     localStorage.getItem("myTableData") || "[]"
              //   );
              //   localStorage.loadData(savedData);
              // }}
              licenseKey="non-commercial-and-evaluation" // for non-commercial use only
            >
              <HotColumn title="ID" readOnly={true} />
              <HotColumn
                title="Data"
                type="date"
                dateFormat="DD/MM/YYYY"
                correctFormat={true}
              />
              <HotColumn title="Dia" type="text" readOnly={true} />
              <HotColumn
                title="Inicio"
                type="time"
                dateFormat="HH:mm"
                format="HH:mm"
                correctFormat={false}
              />
              <HotColumn
                title="Final"
                type="time"
                dateFormat="HH:mm"
                format="HH:mm"
                correctFormat={false}
              />
              <HotColumn
                title="Total"
                readOnly={true}
                type="time"
                timeFormat="hh:mm"
              />
              <HotColumn title="Ajuste" type="time" timeFormat="hh:mm" />
              <HotColumn
                title="Total c/ Ajuste"
                type="time"
                timeFormat="hh:mm"
                readOnly={true}
              />
              <HotColumn
                title="Cliente"
                editor="select"
                selectOptions={clientListNames}
              />
              <HotColumn
                title="Projeto"
                editor="select"
                selectOptions={projectListNames}
              />
              <HotColumn
                title="Atividade"
                editor="select"
                selectOptions={activityListNames}
              />
              <HotColumn title="Descrição" />
              <HotColumn title="Valor" readOnly={true} />
              <HotColumn title="Gerente de Projetos" readOnly={true} />
              <HotColumn title="Consultor" readOnly={true} />
              <HotColumn title="Escopo Fechado" />
              <HotColumn title="Aprovado GP" type="checkbox" />
              <HotColumn title="Faturável" type="checkbox" />
              <HotColumn title="Lançado" type="checkbox" />
              <HotColumn title="Aprovado" type="checkbox" />
              <HotColumn title="Chamado Lançado" />
              <HotColumn title="Criado em" readOnly={true} />
              <HotColumn title="Editado em" readOnly={true} />
            </HotTable>
          </Paper>
        </>
      )}
      <ModalConfirmChanges
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
