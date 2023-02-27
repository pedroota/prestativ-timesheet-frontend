import { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHoursFilters, updateHours } from "services/hours.service";
import {
  Button,
  Typography,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import { Hours, UpdateHoursProps } from "interfaces/hours.interface";
import { ModalRegisterHours } from "pages/Dashboard/pages/Timesheet/components/ModalRegisterHours";
import { EmptyList } from "components/EmptyList";
// import { updateClosedEscope } from "services/activities.service";

import * as XLSX from "xlsx";

// Utils
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateTotalHoursWithAdjustment,
  generateMilisecondsWithHoursAndMinutes,
} from "utils/timeControl";
// import { SwitchIOS } from "components/SwitchIOS";
import { Filters } from "components/Filters";
import { Permission } from "components/Permission";
// import { PatchActivities } from "interfaces/activities.interface";
import { currencyMask } from "utils/masks";
import { useAuthStore } from "stores/userStore";
import { ModalDeleteHours } from "./components/ModalDeleteHours";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridRowModel } from "@mui/x-data-grid/models";

export function Timesheet() {
  const { user } = useAuthStore((state) => state);
  const [isDeletingHour, setIsDeletingHour] = useState(false);
  const [currentHour] = useState("");
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

  const { mutate } = useMutation(
    ({ id, activityDesc, adjustment, releasedCall }: UpdateHoursProps) =>
      updateHours(`${id}`, {
        activityDesc,
        adjustment,
        releasedCall,
      }),
    {
      onSuccess: () => {
        window.location.reload();
      },
    }
  );

  // const { mutate: updateCheck, isLoading: updatingCheck } = useMutation(
  //   ({ _id, field, value }: PatchHour) => checkHours(_id, field, value),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(["hours"]);
  //     },
  //   }
  // );

  // const { mutate: updateEscope, isLoading: updatingEscope } = useMutation(
  //   ({ _id, value }: PatchActivities) => updateClosedEscope(_id, value),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(["hours"]);
  //     },
  //   }
  // );

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
          GerenteProjetos: relActivity.gpActivity
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
      editable: true,
      width: 150,
    },
    {
      field: "descricao",
      headerName: "Descrição",
      sortable: false,
      filterable: false,
      hideable: false,
      editable: true,
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
        gerente_de_projetos: relActivity.gpActivity
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

  const processRowUpdate = useCallback(async (newRow: GridRowModel) => {
    const response = mutate({
      id: newRow.id,
      adjustment: generateMilisecondsWithHoursAndMinutes(newRow.ajuste),
      activityDesc: newRow.descricao,
      releasedCall: newRow.chamado_lancado,
    });
    return response;
  }, []);

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
        <Box sx={{ height: 400, width: "100%" }}>
          {validateUserRegisterHours()?.data ? (
            <>
              <DataGrid
                rows={hours && hoursDataGrid}
                columns={columns}
                pageSize={30}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(error) => console.log(error)}
                loading={isLoading}
                rowsPerPageOptions={[30]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </>
          ) : (
            <EmptyList />
          )}
        </Box>
      )}

      <Permission roles={["LANCAR_HORAS"]}>
        <ModalRegisterHours
          isOpen={isAddingHours}
          setIsOpen={setIsAddingHours}
        />
      </Permission>
      <Permission roles={["DELETAR_HORAS"]}>
        <ModalDeleteHours
          isOpen={isDeletingHour}
          setIsOpen={setIsDeletingHour}
          currentHour={currentHour}
        />
      </Permission>
    </div>
  );
}
