import { useRef, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import {
  checkHours,
  createHours,
  deleteHours,
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
// import { addClassesToRows } from "./hooksCallbacks";

import "handsontable/dist/handsontable.full.min.css";

import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";

import { HotColumn, HotTable } from "@handsontable/react";
import { getClients } from "services/clients.service";
import { toast } from "react-toastify";

registerAllModules();

export function Timesheet() {
  const { user } = useAuthStore((state: any) => state);
  const queryClient = useQueryClient();
  const [isDeletingHour, setIsDeletingHour] = useState(false);
  const [isEditingReleasedCall, setIsEditingReleasedCall] = useState(false);
  const [currentHour, setCurrentHour] = useState("");
  const [stringFilters, setStringFilters] = useState("");
  const { data: hours, isLoading } = useQuery(["hours", stringFilters], () =>
    getHoursFilters(stringFilters)
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
    if (!user.role.permissions.includes("VALOR")) {
      arrayPermissions.push(11);
    }
    if (!user.role.permissions.includes("GERENTE_DE_PROJETOS")) {
      arrayPermissions.push(12);
    }
    if (!user.role.permissions.includes("CONSULTOR")) {
      arrayPermissions.push(13);
    }
    if (!user.role.permissions.includes("ESCOPO_FECHADO")) {
      arrayPermissions.push(14);
    }
    if (!user.role.permissions.includes("APROVADO_GP")) {
      arrayPermissions.push(15);
    }
    if (!user.role.permissions.includes("FATURAVEL")) {
      arrayPermissions.push(16);
    }
    if (!user.role.permissions.includes("LANCADO")) {
      arrayPermissions.push(17);
    }
    if (!user.role.permissions.includes("APROVADO")) {
      arrayPermissions.push(18);
    }
    if (!user.role.permissions.includes("CHAMADO_LANCADO")) {
      arrayPermissions.push(19);
    }
    if (!user.role.permissions.includes("DESCRICAO_DA_ATIVIDADE")) {
      arrayPermissions.push(20);
    }
    if (!user.role.permissions.includes("DATA_SISTEMA_DATA_EDICAO")) {
      arrayPermissions.push(21);
      arrayPermissions.push(22);
    }
    return arrayPermissions;
  };

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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  type Changes = {
    id: number;
    nome: string;
    sobrenome: string;
  };

  const [changes, setChanges] = useState<Changes[]>([]);

  const [selectedId, setSelectedId] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // const { data: clients, isLoading: loadingClients } = useQuery(
  //   ["clients"],
  //   () => getClients()
  // );

  // const [arrayNameClients, setArrayNameClients] = useState([]);

  // const names = clients?.data.map((client: { name: string }) => client.name);

  // loadingClients && setArrayNameClients(names);

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
        Valor:
          relActivity || relProject || relClient
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
          relActivity || relProject || relClient
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
        DescricaoAtividade: activityDesc || " ",
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
        relActivity || relProject || relClient
          ? currencyMask(
              (relActivity?.valueActivity
                ? relActivity.valueActivity
                : relProject.valueProject
                ? relProject.valueProject
                : relClient.valueClient
              ).toString()
            )
          : " ",
        relActivity || relProject || relClient
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
        activityDesc || " ",
        `${generateDateWithTimestamp(createdAt)} ${generateTimeWithTimestamp(
          createdAt
        )}`,
        `${generateDateWithTimestamp(updatedAt)} ${generateTimeWithTimestamp(
          updatedAt
        )}`,
      ];
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
      </Box>
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
                  title="Deletar um Lançamento de Horas"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={async () => {
                      if (selectedIds.length > 0) {
                        try {
                          const promises = selectedIds.map(async (id) => {
                            const index = hoursDataGrid.findIndex(
                              (array: string[]) => array[0] == id
                            );
                            if (
                              !hoursDataGrid[index][15] ||
                              !hoursDataGrid[index][16] ||
                              !hoursDataGrid[index][17] ||
                              !hoursDataGrid[index][18]
                            ) {
                              await deleteHours(id);
                              await new Promise((resolve) =>
                                setTimeout(resolve, 5000)
                              );
                              return { id, deleted: true };
                            } else {
                              return { id, deleted: false };
                            }
                          });
                          const results = await Promise.all(promises);
                          results.forEach((result) => {
                            if (result.deleted) {
                              const index = hoursDataGrid.findIndex(
                                (array: string[]) => array[0] == result.id
                              );
                              hoursDataGrid.splice(index, 1); // Remove o lançamento deletado da grid
                            } else {
                              toast.error(
                                `O lançamento ${result.id} não pode ser deletado.`,
                                {
                                  autoClose: 1500,
                                }
                              );
                            }
                          });
                          toast.success("Finalizado Deletamento", {
                            autoClose: 1500,
                          });
                          queryClient.invalidateQueries(["hours"]);
                          setSelectedIds([]);
                        } catch (error) {
                          console.log(error);
                          toast.error(
                            "Ocorreu um erro ao deletar os lançamentos.",
                            {
                              autoClose: 1500,
                            }
                          );
                        }
                      } else {
                        toast.error("Nenhum lançamento foi selecionado.", {
                          autoClose: 1500,
                        });
                      }
                    }}
                  >
                    Deletar
                  </button>
                </Tooltip>
              </Permission>
              <Permission roles={["LANCAR_HORAS"]}>
                <Tooltip
                  title="Inserir Linha para Lançamento de Horas"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={async () => {
                      await createHours({ relUser: user._id });
                      await queryClient.invalidateQueries(["hours"]);
                      hottable.current.hotInstance.setDataAtCell(0, 3, " ");
                      hottable.current.hotInstance.selectCell(0, 3);
                    }}
                  >
                    Inserir
                  </button>
                </Tooltip>
              </Permission>
              <Permission roles={["EDITAR_HORAS"]}>
                <Tooltip
                  title="Salvar todos os dados que foram modificados"
                  arrow
                  placement="top"
                >
                  <button
                    className="lancarhoras"
                    onClick={() =>
                      console.log("salvando modificações no banco")
                    }
                  >
                    Salvar
                  </button>
                </Tooltip>
                {/* <ModalEditHours
                  isOpen={isEditingHour}
                  setIsOpen={setIsEditingHour}
                  currentHour={currentHour}
                /> */}
              </Permission>
            </div>
          </div>

          <Paper className="c-timesheet">
            <HotTable
              data={hoursDataGrid}
              // afterInit={handleHotTableInit}
              filters={true}
              dropdownMenu={true}
              rowHeaders={true}
              ref={hottable}
              height="500"
              // mergeCells={[
              //   { row: 1, col: 1, rowspan: 2, colspan: 1 },
              //   { row: 3, col: 1, rowspan: 2, colspan: 1 },
              //   { row: 5, col: 1, rowspan: 2, colspan: 1 },
              //   { row: 7, col: 1, rowspan: 2, colspan: 1 },
              //   { row: 1, col: 2, rowspan: 2, colspan: 1 },
              //   { row: 3, col: 2, rowspan: 2, colspan: 1 },
              //   { row: 5, col: 2, rowspan: 2, colspan: 1 },
              //   { row: 7, col: 2, rowspan: 2, colspan: 1 },
              // ]}
              hiddenColumns={{
                indicators: false,
                // columns: [0], esconde o ID
                columns: generateUserPermissions(),
              }}
              afterSelectionEndByProp={(change) => {
                // console.log(hoursDataGrid[change][0]);
                setSelectedId(hoursDataGrid[change][0]);
                setSelectedIndex(change);
              }}
              afterSelection={() => {
                const getRange =
                  hottable.current.hotInstance.getSelectedRange();

                if (getRange.length == 1) {
                  if (getRange[0].from.row !== getRange[0].to.row) {
                    for (
                      let i = getRange[0].from.row;
                      i <= getRange[0].to.row;
                      i++
                    ) {
                      // Isso é um range
                      const id = hoursDataGrid[i][0];
                      setSelectedIds((prevSelectedIds) => [
                        ...prevSelectedIds,
                        id,
                      ]);
                    }
                  } else {
                    // Isso é um lançamento avulso
                    const id = hoursDataGrid[getRange[0].to.row][0];
                    setSelectedIds((prevSelectedIds) => [
                      ...prevSelectedIds,
                      id,
                    ]);
                  }
                } else {
                  // Tem vários lançamentos e/ou vários ranges
                  const newSelectedIds = getRange.flatMap(
                    (range: { from: { row: number }; to: { row: number } }) => {
                      const rangeIds = [];
                      for (let i = range.from.row; i <= range.to.row; i++) {
                        rangeIds.push(hoursDataGrid[i][0]);
                      }
                      return rangeIds;
                    }
                  );
                  setSelectedIds((prevSelectedIds) => [
                    ...prevSelectedIds,
                    ...newSelectedIds,
                  ]);
                }
              }}
              afterChange={(change) => {
                if (!change) return;
                console.log(change);
                console.log(hoursDataGrid[change[0][0]][0]);
                // console.log(change[0][1]);
                // console.log(change[0][3]);

                if (change[0][1] == "ajuste") {
                  updateDataRow(hoursDataGrid[change[0][0]][0], {
                    adjustment: generateMilisecondsWithHoursAndMinutes(
                      change[0][3]
                    ),
                  });
                }
              }}
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
                correctFormat={true}
                timeFormat="hh:mm"
              />
              <HotColumn title="Final" />
              <HotColumn title="Total" readOnly={true} />
              <HotColumn title="Ajuste" />
              <HotColumn title="Total c/ Ajuste" readOnly={true} />
              <HotColumn
                title="Cliente"
                // editor="select"
                // selectOptions={arrayNameClients}
              />
              <HotColumn title="Projeto" />
              <HotColumn title="Atividade" />
              <HotColumn title="Valor" />
              <HotColumn title="Gerente de Projetos" readOnly={true} />
              <HotColumn title="Consultor" readOnly={true} />
              <HotColumn title="Escopo Fechado" />
              <HotColumn title="Aprovado GP" />
              <HotColumn title="Faturável" />
              <HotColumn title="Lançado" />
              <HotColumn title="Aprovado" />
              <HotColumn title="Chamado Lançado" />
              <HotColumn title="Descrição" />
              <HotColumn title="Criado em" readOnly={true} />
              <HotColumn title="Editado em" readOnly={true} />
            </HotTable>
          </Paper>
        </>
      )}
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
