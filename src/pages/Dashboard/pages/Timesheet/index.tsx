import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import {
  checkHours,
  getHoursFilters,
  updateDataRow,
} from "services/hours.service";
import {
  Paper,
  Button,
  Typography,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import BrushIcon from "@mui/icons-material/Brush";
import { Hours, PatchHour } from "interfaces/hours.interface";
import { ModalRegisterHours } from "pages/Dashboard/pages/Timesheet/components/ModalRegisterHours";
import { EmptyList } from "components/EmptyList";
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
  generateMilisecondsWithHoursAndMinutes,
} from "utils/timeControl";
// import { SwitchIOS } from "components/SwitchIOS";
import { ModalEditHours } from "./components/ModalEditHours";
import { Filters } from "components/Filters";
import { Permission } from "components/Permission";
import { PatchActivities } from "interfaces/activities.interface";
import { currencyMask } from "utils/masks";
import { ModalEditReleasedCall } from "./components/ModalEditReleasedCall";
import { useAuthStore } from "stores/userStore";
import { ModalDeleteHours } from "./components/ModalDeleteHours";

import "handsontable/dist/handsontable.full.min.css";

// import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";

import { HotTable } from "@handsontable/react";

registerAllModules();

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

  const handleTransformExcel = () => {
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
              <Permission roles={["EXPORTAR_EXCEL"]}>
                <div className="buttons-export">
                  <Tooltip
                    title="Exportar dados para Excel"
                    arrow
                    placement="top"
                  >
                    <button
                      className="excelbutton"
                      onClick={handleTransformExcel}
                    >
                      Export to XLSX
                    </button>
                  </Tooltip>
                  <div className="csvbutton">
                    <CSVLink data={hourxToExcel}>Export to CSV</CSVLink>
                  </div>
                </div>
              </Permission>
              <HotTable
                data={hoursDataGrid}
                colHeaders={[
                  "ID",
                  "Data",
                  "Dia",
                  "Inicio",
                  "Fim",
                  "Total",
                  "Ajuste",
                  "Total C Ajuste",
                  "Cliente",
                  "Projeto",
                  "Atividade",
                  "Valor",
                  "Gerente de Projetos",
                  "Consultor",
                  "Escopo Fechado",
                  "Aprovado Gp",
                  "Faturável",
                  "Lançado",
                  "Aprovado",
                  "Chamado Lançado",
                  "Descrição",
                  "Criado em",
                  "Editado em",
                ]}
                filters={true}
                dropdownMenu={true}
                rowHeaders={true}
                height="auto"
                mergeCells={[
                  { row: 1, col: 1, rowspan: 2, colspan: 1 },
                  { row: 3, col: 1, rowspan: 2, colspan: 1 },
                  { row: 5, col: 1, rowspan: 2, colspan: 1 },
                  { row: 7, col: 1, rowspan: 2, colspan: 1 },
                  { row: 1, col: 2, rowspan: 2, colspan: 1 },
                  { row: 3, col: 2, rowspan: 2, colspan: 1 },
                  { row: 5, col: 2, rowspan: 2, colspan: 1 },
                  { row: 7, col: 2, rowspan: 2, colspan: 1 },
                ]}
                hiddenColumns={{
                  indicators: true,
                  columns: [0],
                }}
                afterChange={(change) => {
                  if (!change) return;
                  console.log(change);
                  console.log(hoursDataGrid[change[0][0]].id);
                  console.log(change[0][1]);
                  console.log(change[0][3]);

                  if (change[0][1] == "ajuste") {
                    updateDataRow(hoursDataGrid[change[0][0]].id, {
                      adjustment: generateMilisecondsWithHoursAndMinutes(
                        change[0][3]
                      ),
                    });
                  }
                }}
                licenseKey="non-commercial-and-evaluation" // for non-commercial use only
              />
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
    </div>
  );
}
