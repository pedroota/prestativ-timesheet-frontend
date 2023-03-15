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
import { toast } from "react-toastify";

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
    // esse comentario será removido: PRIMEIRO checar as infos, DEPOIS enviar tudo para o banco!
    // efetuar os deletamentos no banco
    if (idsSelectedForDelete.length > 0) {
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
    }
    // Salvar Edições
    if (changes.length > 0) {
      const filteredChanges = changes.filter((change) => {
        return change.id !== null && Object.keys(change).length > 1;
      });
      if (filteredChanges) {
        for (const { id, ...data } of filteredChanges) {
          // adicionando verificação de data
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1;
          const currentDay = currentDate.getDate();
          const currentDateStr = `${currentYear}-${
            currentMonth < 10 ? `0${currentMonth}` : currentMonth
          }-${currentDay < 10 ? `0${currentDay}` : currentDay}`;
          const editedDate = new Date(data?.initial as number);
          const editedYear = editedDate.getFullYear();
          const editedMonth = editedDate.getMonth() + 1;
          const editedDay = editedDate.getDate();
          const editedDateStr = `${editedYear}-${
            editedMonth < 10 ? `0${editedMonth}` : editedMonth
          }-${editedDay < 10 ? `0${editedDay}` : editedDay}`;
          if (editedDateStr < currentDateStr) {
            toast.error(
              `A data ${editedDateStr} foi alterada! Essa ação não está disponível!`
            );
            return;
          }
        }
        for (const { id, ...data } of filteredChanges) {
          await updateHours(id as string, { ...data });
        }
        setChanges([]);
      }
    }
    // Salvar Criações
    if (numberOfNewReleases > 0) {
      const arrayOfCreations = hoursDataGridData.filter(
        (arrayInside: any[]) => arrayInside[0] === null
      );
      for (const data of arrayOfCreations) {
        if (data[1] == null || data[3] == null || data[4] == null) {
          toast.error("Preencha corretamente os campos!");
          return;
        }
      }

      const arrayForDB = processDataForCreation(arrayOfCreations);
      const maxDaysCanRelease = 4; // Periodo máximo para lançar horas - editando essa variável, o sistema irá permitir que datas mais antigas sejam possiveis lançar
      const daysInMiliseconds = maxDaysCanRelease * 1000 * 60 * 60 * 24;
      const today = Date.now();
      const todayDate = new Date();
      const todayDay = todayDate.getDate();
      const todayMonth = todayDate.getMonth() + 1;
      const todayYear = todayDate.getFullYear();
      const todayMaxRelease = generateTimestampWithDateAndTime(
        `${todayYear}-${todayMonth < 10 ? `0${todayMonth}` : todayMonth}-${
          todayDay < 10 ? `0${todayDay}` : todayDay
        }`,
        "23:59"
      );
      for (const data of arrayForDB) {
        if (data.final > todayMaxRelease) {
          const date = new Date(data.initial);
          const dateString = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          toast.error(`A data ${dateString} ainda não está disponível!`);
          return;
        }
      }
      for (const data of arrayForDB) {
        if (data.initial < today - daysInMiliseconds) {
          const date = new Date(data.initial);
          const dateString = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          toast.error(`A data ${dateString} não está disponível!`);
          return;
        }
      }
      for (const data of arrayForDB) {
        if (data.initial > data.final) {
          toast.error("A hora final não pode ser anterior a hora inicial!");
          return;
        }
      }

      for (const { ...data } of arrayForDB) {
        await createHours({ ...data });
      }
      setNumberOfNewReleases(0);
    }

    toast.success("Todas as modificações foram salvas");

    setIsOpen(false);
    queryClient.invalidateQueries(["hours"]);
    // setHoursDataGridData(hoursDataGridData);
    // setTimeout(() => {
    // }, 2000);
  };

  const [numberOfNewReleases, setNumberOfNewReleases] = useState(0);

  const handleUpdatedChanges = (
    idChanged: string,
    index123: number, // essa variável só passa o index da tabela QUE ESTÁ NA TELA (com filtros muda os indices)
    collumnChanged: string | number,
    newValue: string | number | boolean
  ) => {
    // caso não tenha valor de dia inicial ele preencherá o dia da semana só com a data

    const index = idChanged
      ? hoursDataGridData.findIndex((arr: string[]) => arr[0] === idChanged)
      : index123;

    // console.log(idChanged);
    // console.log(index);

    const updatingId = changes.find((o) => o.id === idChanged);
    const newChanges = [...changes]; // cria uma cópia do array de changes

    if (!updatingId && idChanged) {
      newChanges.push({ id: idChanged });
    }

    // Alterando Data
    if (collumnChanged == 1) {
      const initialHour = hoursDataGridData[index][3];
      const finalHour = hoursDataGridData[index][4];
      const date = convertDate(newValue as string);

      // altera o valor que está no DIA ATUAL (SEG / TER / QUA)
      const dayWeek = generateDayWeekWithTimestamp(
        generateTimestampWithDateAndTime(date, "15:00")
      );
      hottable.current.hotInstance.setDataAtCell(index123, 2, dayWeek);

      if (initialHour && initialHour.length > 4) {
        const updatingId = newChanges.find((o) => o.id === idChanged);
        if (updatingId) {
          updatingId.initial = generateTimestampWithDateAndTime(
            date,
            initialHour
          );
        }
      }

      if (finalHour && finalHour.length > 4) {
        const updatingId = newChanges.find((o) => o.id === idChanged);
        if (updatingId) {
          updatingId.final = generateTimestampWithDateAndTime(date, finalHour);
        }
      }
    }

    if (collumnChanged === 3 || collumnChanged === 4) {
      const insertedValue = newValue as string;
      const regex = /^\d{2}:\d{2}$/; // expressão regular para o formato HH:mm
      const regexLetters = /[A-Za-z]/; // expressão regular que verifica se tem letras na string
      if (!regex.test(insertedValue)) {
        let hours = 0;
        let minutes = 0;
        if (insertedValue.length === 4 && !regexLetters.test(insertedValue)) {
          hours = parseInt(insertedValue.substring(0, 2));
          minutes = parseInt(insertedValue.substring(2, 4));
        } else {
          toast.error("Digite um horário válido.");
          return;
        }
        if (hours > 23 || minutes > 59) {
          toast.error("Digite um horário válido.");
          return;
        }
        if (regexLetters.test(insertedValue)) {
          toast.error("esse campo não aceita letras");
          hottable.current.hotInstance.setDataAtCell(
            index123,
            collumnChanged,
            "00:00"
          );
          return;
        }
        const formattedValue = moment(insertedValue, "HHmm").format("HH:mm");

        hottable.current.hotInstance.setDataAtCell(
          index123,
          collumnChanged,
          formattedValue
        );
        return;
      }

      // Alterando Inicio
      if (collumnChanged == 3) {
        const initialHour = newValue as string;
        const date = convertDate(hoursDataGridData[index][1]);
        const [hoursI, minutesI] = initialHour.split(":").map(parseInt);
        if (hoursI > 23 || minutesI > 59) {
          toast.error("Digite um horário válido.");
          return;
        }

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
        const [hoursF, minutesF] = finalHour.split(":").map(parseInt);
        if (hoursF > 23 || minutesF > 59) {
          toast.error("Digite um horário válido.");
          return;
        }
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
    }

    // Alterando Ajuste
    if (collumnChanged === 6) {
      const insertedValue = newValue as string;
      const regex = /^(-?\d{2}):(\d{2})$/; // expressão regular para o formato HH:mm ou -HH:mm
      const regexLetters = /[A-Za-z]/; // expressão regular que verifica se tem letras na string
      if (!regex.test(insertedValue)) {
        let hours = 0;
        let minutes = 0;
        const isNegative = insertedValue.startsWith("-") ? true : false;
        const hourString = isNegative
          ? insertedValue.substring(1)
          : insertedValue;
        if (hourString.length === 4 && !regexLetters.test(hourString)) {
          hours = parseInt(hourString.substring(0, 2));
          minutes = parseInt(hourString.substring(2, 4));
        } else {
          toast.error("Digite um horário válido.");
          return;
        }
        if (hours > 23 || minutes > 59) {
          toast.error("Digite um horário válido.");
          return;
        }
        if (regexLetters.test(hourString)) {
          toast.error("esse campo não aceita letras");
          hottable.current.hotInstance.setDataAtCell(
            index123,
            collumnChanged,
            "00:00"
          );
          return;
        }
        const formattedValue = moment(hourString, "HHmm").format("HH:mm");

        hottable.current.hotInstance.setDataAtCell(
          index123,
          collumnChanged,
          isNegative ? `-${formattedValue}` : formattedValue
        );
        return;
      }

      // definição
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
          Number(
            (relActivity.valueActivity
              ? relActivity.valueActivity
              : relProject.valueProject
              ? relProject.valueProject
              : relClient.valueClient
            ).toString()
          ) *
          (parseFloat(
            generateTotalHoursWithAdjustment(initial, final, adjustment).split(
              ":"
            )[0]
          ) +
            parseFloat(
              generateTotalHoursWithAdjustment(
                initial,
                final,
                adjustment
              ).split(":")[1]
            ) /
              60),
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
    if (user.typeField !== "nenhum") {
      return hoursByUser;
    } else {
      return hours;
    }
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
        relActivity && relProject && relClient && initial && final
          ? (
              Number(
                (relActivity.valueActivity
                  ? relActivity.valueActivity
                  : relProject.valueProject
                  ? relProject.valueProject
                  : relClient.valueClient
                ).toString()
              ) *
              (parseFloat(
                generateTotalHoursWithAdjustment(
                  initial,
                  final,
                  adjustment ? adjustment : 0
                ).split(":")[0]
              ) +
                parseFloat(
                  generateTotalHoursWithAdjustment(
                    initial,
                    final,
                    adjustment ? adjustment : 0
                  ).split(":")[1]
                ) /
                  60)
            ).toFixed(2)
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
                      const selectedIds = selectedRows.map((index) =>
                        hottable.current.hotInstance.getDataAtCell(
                          Number(index),
                          0
                        )
                      );

                      arrayOfRows.forEach((num) => {
                        hottable.current.hotInstance.alter("remove_row", num);
                      });

                      setIdsSelectedForDelete([
                        ...idsSelectedForDelete,
                        ...selectedIds,
                      ]);
                      setSelectedRows([]);
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
                      if (hoursDataGridData.length === 0) {
                        setHoursDataGridData([
                          [
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            `${user.name} ${user.surname}`,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            `${generateDateWithTimestamp(
                              Date.now()
                            )} ${generateTimeWithTimestamp(Date.now())}`,
                            null,
                          ],
                        ]);
                        setNumberOfNewReleases(numberOfNewReleases + 1);
                      } else {
                        setHoursDataGridData([
                          [
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            `${user.name} ${user.surname}`,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            `${generateDateWithTimestamp(
                              Date.now()
                            )} ${generateTimeWithTimestamp(Date.now())}`,
                            null,
                          ],
                          ...hoursDataGridData,
                        ]);
                        setNumberOfNewReleases(numberOfNewReleases + 1);
                      }
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
                  title="Botão utilizado apenas em ambiente dev - só é possivel enxergar ele com a permissão DEVELOPER"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={async () => {
                      console.log("modificações que serão enviadas no banco:");
                      console.log("DELETAR:");
                      console.log(idsSelectedForDelete);
                      console.log("EDIÇÕES:");
                      console.log(changes);
                      console.log("CRIAÇÕES:");
                      console.log(numberOfNewReleases);
                      console.log("ARRAY DE ARRAYS PARA SER PROCESSADO:");
                      console.log(hoursDataGridData);
                      console.log("CONFIGS USUARIO:");
                      console.log(user);
                      console.log("ARRAY DE CLIENTES:");
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
              height="60vh"
              width="100%"
              // mergeCells={}
              hiddenColumns={{
                indicators: false,
                // columns: [0], esconde o ID
                columns: [...generateUserPermissions()],
                // columns: [0, ...generateUserPermissions()],
              }}
              beforeOnCellMouseDown={() => {
                hottable.current.hotInstance.deselectCell();
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
                // console.log(getRange);
                // console.log(row, column);
                if (getRange.length === 1) {
                  // só aceita um range por vez
                  const range = getRange[0];
                  if (
                    range.from.col === -1 &&
                    range.to.col === hoursDataGridData[0].length - 1
                  ) {
                    // verifica se é uma linha completa
                    const newSelectedRows = [];
                    for (let i = range.from.row; i <= range.to.row; i++) {
                      newSelectedRows.push(i);
                    }
                    setSelectedRows(newSelectedRows);
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
                const index = changes[0][0];
                const idChanged = hottable.current.hotInstance.getDataAtCell(
                  index,
                  0
                );
                const collumnChanged = changes[0][1];
                const newValue = changes[0][3];
                handleUpdatedChanges(
                  idChanged,
                  index,
                  collumnChanged,
                  newValue
                );
                if (source === "edit") {
                  hottable.current.hotInstance.deselectCell();
                }
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
