import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { checkHours, getHoursFilters } from "services/hours.service";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BrushIcon from "@mui/icons-material/Brush";
import { Hours, PatchHour } from "interfaces/hours.interface";
import { ModalRegisterHours } from "pages/Dashboard/pages/Timesheet/components/ModalRegisterHours";
import { EmptyList } from "components/EmptyList";
import { StyledTableRow } from "components/StyledTableRow";
import { StyledTableCell } from "components/StyledTableCell";
import { updateClosedEscope } from "services/activities.service";

import * as XLSX from "xlsx";

// Utils
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateTotalHoursWithAdjustment,
} from "utils/timeControl";
import { SwitchIOS } from "components/SwitchIOS";
import { ModalEditHours } from "./components/ModalEditHours";
import { Filters } from "components/Filters";
import { Permission } from "components/Permission";
import { PatchActivities } from "interfaces/activities.interface";
import { currencyMask } from "utils/masks";
import { ModalEditReleasedCall } from "./components/ModalEditReleasedCall";
import { useAuthStore } from "stores/userStore";
import { ModalDeleteHours } from "./components/ModalDeleteHours";
import Chip from "@mui/material/Chip";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export function Timesheet() {
  const { user } = useAuthStore((state) => state);
  const queryClient = useQueryClient();
  const [isDeletingHour, setIsDeletingHour] = useState(false);
  const [isEditingHour, setIsEditingHour] = useState(false);
  const [isEditingReleasedCall, setIsEditingReleasedCall] = useState(false);
  const [currentHour, setCurrentHour] = useState("");
  const [isAddingHours, setIsAddingHours] = useState(false);
  const [stringFilters, setStringFilters] = useState("");
  const { data: hours, isLoading } = useQuery(["hours", stringFilters], () =>
    getHoursFilters(stringFilters)
  );

  const { data: hoursByUser } = useQuery(
    ["hours", user._id, stringFilters],
    () =>
      getHoursFilters(
        stringFilters
          ? `${stringFilters}&relUser=${user._id}`
          : `relUser=${user._id}`
      )
  );

  const { mutate: updateCheck, isLoading: updatingCheck } = useMutation(
    ({ _id, field, value }: PatchHour) => checkHours(_id, field, value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hours"]);
      },
    }
  );

  const { mutate: updateEscope, isLoading: updatingEscope } = useMutation(
    ({ _id, value }: PatchActivities) => updateClosedEscope(_id, value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hours"]);
      },
    }
  );

  const receiveDataURI = (encondeURIParams: string) => {
    const decoded = encondeURIParams.replaceAll("%3D", "=");
    setStringFilters(decoded);
  };

  const handleTransformExcel = () => {
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
          Data: generateDateWithTimestamp(initial),
          DiaSemana: generateDayWeekWithTimestamp(initial),
          HoraInicial: generateTimeWithTimestamp(initial),
          HoraFinal: generateTimeWithTimestamp(final),
          Total: generateTotalHours(initial, final),
          Ajuste: generateAdjustmentWithNumberInMilliseconds(adjustment),
          TotalAjuste: generateTotalHoursWithAdjustment(
            initial,
            final,
            adjustment
          ),
          Cliente: relClient?.name,
          Projeto: relProject?.title,
          Atividade: relActivity?.title,
          Valor: Number(
            (relActivity.valueActivity
              ? relActivity.valueActivity
              : relProject.valueProject
              ? relProject.valueProject
              : relClient.valueClient
            ).toString()
          ),
          GerenteProjetos: relActivity.gpActivity.length
            ? relActivity.gpActivity
                .map(({ name, surname }) => `${name} ${surname}`)
                .join(", ")
            : relProject.gpProject && relProject.gpProject.length
            ? relProject.gpProject.reduce(
                (accumulator, { name, surname }) =>
                  `${accumulator}${
                    accumulator.length > 0 ? ", " : ""
                  }${name} ${surname}`,
                ""
              )
            : relClient.gpClient && relClient.gpClient.length
            ? relClient.gpClient
                .map(({ name, surname }) => `${name} ${surname}`)
                .join(", ")
            : "Nenhum usuário foi vinculado",
          Consultor: `${relUser?.name} ${relUser?.surname}`,
          EscopoFechado: relActivity?.closedScope ? "sim" : "não",
          AprovadoGP: approvedGP ? "sim" : "não",
          Faturável: billable ? "sim" : "não",
          Lançado: released ? "sim" : "não",
          Aprovado: approved ? "sim" : "não",
          ChamadoLancado: releasedCall ? releasedCall : " ",
          DescricaoAtividade: activityDesc,
          DataCriacao: `${generateDateWithTimestamp(
            createdAt
          )} ${generateTimeWithTimestamp(createdAt)}`,
          DataEdicao: `${generateDateWithTimestamp(
            updatedAt
          )} ${generateTimeWithTimestamp(updatedAt)}`,
        });
      }
    );
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(hourxToExcel);
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");
    XLSX.writeFile(wb, "TimesheetExcel.xlsx");
  };

  const validateUserRegisterHours = () => {
    if (user.typeField !== "nenhum") {
      return hoursByUser;
    }
    return hours;
  };

  const columns: GridColDef[] = [
    {
      field: "data",
      headerName: "Data",
      width: 100,
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "dia",
      headerName: "Dia",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 55,
    },
    {
      field: "hora_inicial",
      headerName: "Inicio",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 60,
    },
    {
      field: "hora_final",
      headerName: "Final",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 60,
    },
    {
      field: "total",
      headerName: "Total",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 60,
    },
    {
      field: "ajuste",
      headerName: "Ajuste",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 60,
      editable: true,
    },
    {
      field: "total_com_ajuste",
      headerName: "Total c/ Ajuste",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 90,
    },
    {
      field: "cliente",
      headerName: "Cliente",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 100,
    },
    {
      field: "projeto",
      headerName: "Projeto",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 100,
    },
    {
      field: "atividade",
      headerName: "Atividade",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 200,
    },
    {
      field: "valor",
      headerName: "Valor",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 90,
    },
    {
      field: "gerente_de_projetos",
      headerName: "Gerente de Projetos",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 130,
    },
    {
      field: "consultor",
      headerName: "Consultor",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 130,
    },
    {
      field: "escopo_fechado",
      headerName: "Escopo Fechado",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: "aprovado_GP",
      headerName: "Aprovado GP",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: "faturavel",
      headerName: "Faturável",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: "lancado",
      headerName: "Lançado",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: "aprovado",
      headerName: "Aprovado",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 80,
    },
    {
      field: "chamado_lancado",
      headerName: "Chamado Lançado",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 150,
    },
    {
      field: "descricao",
      headerName: "Descrição",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 200,
    },
    {
      field: "data_criacao",
      headerName: "Data Criação",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 100,
    },
    {
      field: "data_edicao",
      headerName: "Data Edição",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 100,
    },
  ];

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
      return {
        id: _id,
        data: generateDateWithTimestamp(initial),
        dia: generateDayWeekWithTimestamp(initial),
        hora_inicial: generateTimeWithTimestamp(initial),
        hora_final: generateTimeWithTimestamp(final),
        total: generateTotalHours(initial, final),
        ajuste: generateAdjustmentWithNumberInMilliseconds(adjustment),
        total_com_ajuste: generateTotalHoursWithAdjustment(
          initial,
          final,
          adjustment
        ),
        cliente: relClient ? relClient?.name : "Sem cliente",
        projeto: relProject ? relProject?.title : "Sem projeto",
        atividade: relActivity ? relActivity?.title : "Sem atividade",
        valor:
          relActivity || relProject || relClient
            ? currencyMask(
                (relActivity?.valueActivity
                  ? relActivity.valueActivity
                  : relProject.valueProject
                  ? relProject.valueProject
                  : relClient.valueClient
                ).toString()
              )
            : "Sem valor",
        gerente_de_projetos: relActivity.gpActivity.length
          ? relActivity.gpActivity
              .map(({ name, surname }) => `${name} ${surname}`)
              .join(", ")
          : relProject.gpProject && relProject.gpProject.length
          ? relProject.gpProject.reduce(
              (accumulator, { name, surname }) =>
                `${accumulator}${
                  accumulator.length > 0 ? ", " : ""
                }${name} ${surname}`,
              ""
            )
          : relClient.gpClient && relClient.gpClient.length
          ? relClient.gpClient
              .map(({ name, surname }) => `${name} ${surname}`)
              .join(", ")
          : "Nenhum usuário foi vinculado",
        consultor: `${relUser?.name} ${relUser?.surname}`,
        escopo_fechado: relActivity.closedScope,
        aprovado_GP: approvedGP,
        faturavel: billable,
        lancado: released,
        aprovado: approved,
        chamado_lancado: releasedCall,
        descricao: activityDesc,
        data_criacao: `${generateDateWithTimestamp(
          createdAt
        )} ${generateTimeWithTimestamp(createdAt)}`,
        data_edicao: `${generateDateWithTimestamp(
          updatedAt
        )} ${generateTimeWithTimestamp(updatedAt)}`,
      };
    }
  );

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexDirection: "row-reverse",
          }}
        >
          <Permission roles={["LANCAR_HORAS"]}>
            <Tooltip title="Cadastre novas horas" arrow placement="top">
              <Button
                onClick={() => setIsAddingHours((prevState) => !prevState)}
                variant="contained"
                color="warning"
                sx={{
                  marginBottom: "0.8rem",
                  paddingInline: "1rem",
                  paddingBlock: "0.8rem",
                }}
              >
                Lançar horas
              </Button>
            </Tooltip>
          </Permission>
          <Permission roles={["EXPORTAR_EXCEL"]}>
            <Tooltip title="Exportar dados para Excel" arrow placement="top">
              <Button
                onClick={handleTransformExcel}
                variant="contained"
                color="success"
                sx={{
                  marginBottom: "0.8rem",
                  paddingInline: "1rem",
                  paddingBlock: "0.8rem",
                }}
              >
                Exportar Excel
              </Button>
            </Tooltip>
          </Permission>
        </Box>
      </Box>
      <Filters receiveDataURI={receiveDataURI} />
      {isLoading ? (
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
          {validateUserRegisterHours()?.data.length ? (
            <Paper className="c-timesheet">
              <div className="c-table">
                <div className="c-table--helper">
                  <Table className="c-table" aria-label="customized table">
                    <TableHead>
                      <TableRow className="c-table--reset-head">
                        <Permission roles={["DATA"]}>
                          <StyledTableCell align="center">Data</StyledTableCell>
                        </Permission>
                        <Permission roles={["DIA_DA_SEMANA"]}>
                          <StyledTableCell align="center">Dia</StyledTableCell>
                        </Permission>
                        <Permission roles={["HORA_INICIAL"]}>
                          <StyledTableCell align="center">
                            Inicio
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["HORA_FINAL"]}>
                          <StyledTableCell align="center">Fim</StyledTableCell>
                        </Permission>
                        <Permission roles={["TOTAL"]}>
                          <StyledTableCell align="center">
                            Total
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["AJUSTE"]}>
                          <StyledTableCell align="center">
                            Ajuste
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["TOTAL_COM_AJUSTE"]}>
                          <StyledTableCell align="center">
                            Total c/ Ajuste
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["CLIENTE"]}>
                          <StyledTableCell align="center">
                            Cliente
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["PROJETO"]}>
                          <StyledTableCell align="center">
                            Projeto
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["ATIVIDADE"]}>
                          <StyledTableCell align="center">
                            Atividade
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["VALOR"]}>
                          <StyledTableCell align="center">
                            Valor
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["GERENTE_DE_PROJETOS"]}>
                          <StyledTableCell align="center">
                            Gerente de Projetos
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["CONSULTOR"]}>
                          <StyledTableCell align="center">
                            Consultor
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["ESCOPO_FECHADO"]}>
                          <StyledTableCell align="center">
                            Escopo Fechado
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["APROVADO_GP"]}>
                          <StyledTableCell align="center">
                            Aprovado GP
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["FATURAVEL"]}>
                          <StyledTableCell align="center">
                            Faturável
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["LANCADO"]}>
                          <StyledTableCell align="center">
                            Lançado
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["APROVADO"]}>
                          <StyledTableCell align="center">
                            Aprovado
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["CHAMADO_LANCADO"]}>
                          <StyledTableCell align="center">
                            Chamado Lançado
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["DESCRICAO_DA_ATIVIDADE"]}>
                          <StyledTableCell align="center">
                            Descrição da Atividade
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["DATA_SISTEMA_DATA_EDICAO"]}>
                          <StyledTableCell align="center">
                            Data Sistema / Data Edição
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["EDITAR_HORAS" || "DELETAR_HORAS"]}>
                          <StyledTableCell align="center">
                            Controles
                          </StyledTableCell>
                        </Permission>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {validateUserRegisterHours()?.data.map(
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
                        }: Hours) => (
                          <StyledTableRow key={_id}>
                            <Permission roles={["DATA"]}>
                              <StyledTableCell align="center">
                                {generateDateWithTimestamp(initial)}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["DIA_DA_SEMANA"]}>
                              <StyledTableCell align="center">
                                {generateDayWeekWithTimestamp(initial)}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["HORA_INICIAL"]}>
                              <StyledTableCell align="center">
                                {generateTimeWithTimestamp(initial)}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["HORA_FINAL"]}>
                              <StyledTableCell align="center">
                                {generateTimeWithTimestamp(final)}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["TOTAL"]}>
                              <StyledTableCell align="center">
                                {generateTotalHours(initial, final)}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["AJUSTE"]}>
                              <StyledTableCell align="center">
                                {generateAdjustmentWithNumberInMilliseconds(
                                  adjustment
                                )}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["TOTAL_COM_AJUSTE"]}>
                              <StyledTableCell align="center">
                                {generateTotalHoursWithAdjustment(
                                  initial,
                                  final,
                                  adjustment
                                )}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["CLIENTE"]}>
                              <StyledTableCell align="center">
                                {relClient
                                  ? relClient?.name
                                  : "Sem cliente especificado"}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["PROJETO"]}>
                              <StyledTableCell align="center">
                                {relProject
                                  ? relProject?.title
                                  : "Sem projeto especificado"}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["ATIVIDADE"]}>
                              <StyledTableCell align="center">
                                {relActivity
                                  ? relActivity?.title
                                  : "Sem atividade especificada"}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["VALOR"]}>
                              <StyledTableCell align="center">
                                {relActivity || relProject || relClient
                                  ? currencyMask(
                                      (relActivity?.valueActivity
                                        ? relActivity.valueActivity
                                        : relProject.valueProject
                                        ? relProject.valueProject
                                        : relClient.valueClient
                                      ).toString()
                                    )
                                  : "Sem valor especificado"}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["GERENTE_DE_PROJETOS"]}>
                              <StyledTableCell align="center">
                                {relActivity.gpActivity.length ? (
                                  relActivity.gpActivity.map(
                                    ({ name, surname }) => (
                                      <Chip
                                        key={name}
                                        label={`${name} ${surname}`}
                                        sx={{ margin: "0.25rem" }}
                                      />
                                    )
                                  )
                                ) : relProject.gpProject.length ? (
                                  relProject.gpProject.map(
                                    ({ name, surname }) => (
                                      <Chip
                                        key={name}
                                        label={`${name} ${surname}`}
                                        sx={{ margin: "0.25rem" }}
                                      />
                                    )
                                  )
                                ) : relClient.gpClient.length ? (
                                  relClient.gpClient.map(
                                    ({ name, surname }) => (
                                      <Chip
                                        key={name}
                                        label={`${name} ${surname}`}
                                        sx={{ margin: "0.25rem" }}
                                      />
                                    )
                                  )
                                ) : (
                                  <p>Nenhum usuário foi vinculado</p>
                                )}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["CONSULTOR"]}>
                              <StyledTableCell align="center">
                                <Chip
                                  key={relUser?.name}
                                  label={`${relUser?.name} ${relUser?.surname}`}
                                  sx={{ margin: "0.25rem" }}
                                />
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["ESCOPO_FECHADO"]}>
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={
                                    relActivity && relActivity?.closedScope
                                  }
                                  disabled={updatingEscope}
                                  onChange={() =>
                                    updateEscope({
                                      _id: relActivity && relActivity._id,
                                      value:
                                        relActivity &&
                                        !relActivity?.closedScope,
                                    })
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["APROVADO_GP"]}>
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={approvedGP}
                                  disabled={updatingCheck}
                                  onChange={() =>
                                    updateCheck({
                                      _id,
                                      field: "approvedGP",
                                      value: !approvedGP,
                                    })
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["FATURAVEL"]}>
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={billable}
                                  disabled={updatingCheck}
                                  onChange={() =>
                                    updateCheck({
                                      _id,
                                      field: "billable",
                                      value: !billable,
                                    })
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["LANCADO"]}>
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={released}
                                  disabled={updatingCheck}
                                  onChange={() =>
                                    updateCheck({
                                      _id,
                                      field: "released",
                                      value: !released,
                                    })
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["APROVADO"]}>
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={approved}
                                  disabled={updatingCheck}
                                  onChange={() =>
                                    updateCheck({
                                      _id,
                                      field: "approved",
                                      value: !approved,
                                    })
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["CHAMADO_LANCADO"]}>
                              <StyledTableCell align="center">
                                {releasedCall ? releasedCall : " "}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["DESCRICAO_DA_ATIVIDADE"]}>
                              <StyledTableCell align="center">
                                {activityDesc}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["DATA_SISTEMA_DATA_EDICAO"]}>
                              <StyledTableCell align="center">
                                {`${generateDateWithTimestamp(
                                  createdAt
                                )} ${generateTimeWithTimestamp(
                                  createdAt
                                )} ${generateDateWithTimestamp(
                                  updatedAt
                                )} ${generateTimeWithTimestamp(updatedAt)}`}
                              </StyledTableCell>
                            </Permission>
                            <Permission
                              roles={["EDITAR_HORAS" || "DELETAR_HORAS"]}
                            >
                              <StyledTableCell align="center">
                                {approvedGP ||
                                billable ||
                                released ||
                                approved ? (
                                  !released ? (
                                    <Permission
                                      roles={["EDITAR_CHAMADO_LANCADO"]}
                                    >
                                      <BrushIcon
                                        onClick={() => {
                                          setCurrentHour(_id);
                                          setIsEditingReleasedCall(
                                            (prevState) => !prevState
                                          );
                                        }}
                                      />
                                    </Permission>
                                  ) : null
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "20px",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Permission
                                      roles={["EDITAR_CHAMADO_LANCADO"]}
                                    >
                                      <BrushIcon
                                        onClick={() => {
                                          setCurrentHour(_id);
                                          setIsEditingReleasedCall(
                                            (prevState) => !prevState
                                          );
                                        }}
                                      />
                                    </Permission>
                                    <Permission roles={["EDITAR_HORAS"]}>
                                      <EditIcon
                                        onClick={() => {
                                          setCurrentHour(_id);
                                          setIsEditingHour(
                                            (prevState) => !prevState
                                          );
                                        }}
                                      />
                                    </Permission>
                                    <Permission roles={["DELETAR_HORAS"]}>
                                      <DeleteIcon
                                        onClick={() => {
                                          setCurrentHour(_id);
                                          setIsDeletingHour(
                                            (prevState) => !prevState
                                          );
                                        }}
                                      />
                                    </Permission>
                                  </Box>
                                )}
                              </StyledTableCell>
                            </Permission>
                          </StyledTableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Paper>
          ) : (
            <EmptyList />
          )}
        </>
      )}

      <Permission roles={["LANCAR_HORAS"]}>
        <ModalRegisterHours
          isOpen={isAddingHours}
          setIsOpen={setIsAddingHours}
        />
      </Permission>
      <Permission roles={["EDITAR_HORAS"]}>
        <ModalEditHours
          isOpen={isEditingHour}
          setIsOpen={setIsEditingHour}
          currentHour={currentHour}
        />
      </Permission>
      <Permission roles={["EDITAR_CHAMADO_LANCADO"]}>
        <ModalEditReleasedCall
          isOpen={isEditingReleasedCall}
          setIsOpen={setIsEditingReleasedCall}
          currentHour={currentHour}
        />
      </Permission>
      <Permission roles={["DELETAR_HORAS"]}>
        <ModalDeleteHours
          isOpen={isDeletingHour}
          setIsOpen={setIsDeletingHour}
          currentHour={currentHour}
        />
      </Permission>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={hoursDataGrid}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  );
}
