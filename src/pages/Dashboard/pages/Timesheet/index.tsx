import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { checkHours, getHoursFilters } from "services/hours.service";
import {
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
                  <table className="c-table" aria-label="customized table">
                    <thead>
                      <tr className="c-table--reset-head">
                        <Permission roles={["DATA"]}>
                          <td align="center">
                            <div>Data</div>
                          </td>
                        </Permission>
                        <Permission roles={["DIA_DA_SEMANA"]}>
                          <td align="center">
                            <div>Dia</div>
                          </td>
                        </Permission>
                        <Permission roles={["HORA_INICIAL"]}>
                          <td align="center">
                            <div>Inicio</div>
                          </td>
                        </Permission>
                        <Permission roles={["HORA_FINAL"]}>
                          <td align="center">
                            <div>Fim</div>
                          </td>
                        </Permission>
                        <Permission roles={["TOTAL"]}>
                          <td align="center">
                            <div>Total</div>
                          </td>
                        </Permission>
                        <Permission roles={["AJUSTE"]}>
                          <td align="center">
                            <div>Ajuste</div>
                          </td>
                        </Permission>
                        <Permission roles={["TOTAL_COM_AJUSTE"]}>
                          <td align="center">
                            <div>Total c/ Ajuste</div>
                          </td>
                        </Permission>
                        <Permission roles={["CLIENTE"]}>
                          <td align="center">
                            <div>Cliente</div>
                          </td>
                        </Permission>
                        <Permission roles={["PROJETO"]}>
                          <td align="center">
                            <div>Projeto</div>
                          </td>
                        </Permission>
                        <Permission roles={["ATIVIDADE"]}>
                          <td align="center">
                            <div>Atividade</div>
                          </td>
                        </Permission>
                        <Permission roles={["DESCRICAO_DA_ATIVIDADE"]}>
                          <td align="center">
                            <div>Descrição da Atividade</div>
                          </td>
                        </Permission>
                        <Permission roles={["CHAMADO_LANCADO"]}>
                          <td align="center">
                            <div>Chamado Lançado</div>
                          </td>
                        </Permission>
                        <Permission roles={["VALOR"]}>
                          <td align="center">
                            <div>Valor</div>
                          </td>
                        </Permission>
                        <Permission roles={["GERENTE_DE_PROJETOS"]}>
                          <td align="center">
                            <div>Gerente de Projetos</div>
                          </td>
                        </Permission>
                        <Permission roles={["CONSULTOR"]}>
                          <td align="center">
                            <div>Consultor</div>
                          </td>
                        </Permission>
                        <Permission roles={["ESCOPO_FECHADO"]}>
                          <td align="center">
                            <div>Escopo Fechado</div>
                          </td>
                        </Permission>
                        <Permission roles={["APROVADO_GP"]}>
                          <td align="center">
                            <div>Aprovado GP</div>
                          </td>
                        </Permission>
                        <Permission roles={["FATURAVEL"]}>
                          <td align="center">
                            <div>Faturável</div>
                          </td>
                        </Permission>
                        <Permission roles={["LANCADO"]}>
                          <td align="center">
                            <div>Lançado</div>
                          </td>
                        </Permission>
                        <Permission roles={["APROVADO"]}>
                          <td align="center">
                            <div>Aprovado</div>
                          </td>
                        </Permission>
                        <Permission roles={["DATA_SISTEMA_DATA_EDICAO"]}>
                          <td align="center">
                            <div>Data Sistema / Data Edição</div>
                          </td>
                        </Permission>
                        <Permission roles={["EDITAR_HORAS" || "DELETAR_HORAS"]}>
                          <td align="center">
                            <div>Controles</div>
                          </td>
                        </Permission>
                      </tr>
                    </thead>
                    <tbody>
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
                          <tr className="c-table--reset-body" key={_id}>
                            <Permission roles={["DATA"]}>
                              {/* rowSpan={0} */}
                              <td align="center">
                                {generateDateWithTimestamp(initial)}
                              </td>
                            </Permission>
                            <Permission roles={["DIA_DA_SEMANA"]}>
                              <td align="center">
                                {generateDayWeekWithTimestamp(initial)}
                              </td>
                            </Permission>
                            <Permission roles={["HORA_INICIAL"]}>
                              <td align="center">
                                {generateTimeWithTimestamp(initial)}
                              </td>
                            </Permission>
                            <Permission roles={["HORA_FINAL"]}>
                              <td align="center">
                                {generateTimeWithTimestamp(final)}
                              </td>
                            </Permission>
                            <Permission roles={["TOTAL"]}>
                              <td className="green-cell" align="center">
                                {generateTotalHours(initial, final)}
                              </td>
                            </Permission>
                            <Permission roles={["AJUSTE"]}>
                              <td align="center">
                                {generateAdjustmentWithNumberInMilliseconds(
                                  adjustment
                                )}
                              </td>
                            </Permission>
                            <Permission roles={["TOTAL_COM_AJUSTE"]}>
                              <td align="center">
                                {generateTotalHoursWithAdjustment(
                                  initial,
                                  final,
                                  adjustment
                                )}
                              </td>
                            </Permission>
                            <Permission roles={["CLIENTE"]}>
                              <td className="client" align="center">
                                {relClient
                                  ? relClient?.name
                                  : "Sem cliente especificado"}
                              </td>
                            </Permission>
                            <Permission roles={["PROJETO"]}>
                              <td className="project" align="center">
                                {relProject
                                  ? relProject?.title
                                  : "Sem projeto especificado"}
                              </td>
                            </Permission>
                            <Permission roles={["ATIVIDADE"]}>
                              <td className="activity" align="center">
                                {relActivity
                                  ? relActivity?.title
                                  : "Sem atividade especificada"}
                              </td>
                            </Permission>
                            <Permission roles={["DESCRICAO_DA_ATIVIDADE"]}>
                              <td className="description" align="center">
                                {activityDesc}
                              </td>
                            </Permission>
                            <Permission roles={["CHAMADO_LANCADO"]}>
                              <td className="releasedcall" align="center">
                                {releasedCall ? releasedCall : " "}
                              </td>
                            </Permission>
                            <Permission roles={["VALOR"]}>
                              <td className="value" align="center">
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
                              </td>
                            </Permission>

                            <Permission roles={["GERENTE_DE_PROJETOS"]}>
                              <td className="names" align="center">
                                {relActivity.gpActivity.length
                                  ? relActivity.gpActivity
                                      .map(
                                        ({ name, surname }) =>
                                          `${name} ${surname}`
                                      )
                                      .join(", ")
                                  : relProject.gpProject &&
                                    relProject.gpProject.length
                                  ? relProject.gpProject.reduce(
                                      (accumulator, { name, surname }) =>
                                        `${accumulator}${
                                          accumulator.length > 0 ? ", " : ""
                                        }${name} ${surname}`,
                                      ""
                                    )
                                  : relClient.gpClient &&
                                    relClient.gpClient.length
                                  ? relClient.gpClient
                                      .map(
                                        ({ name, surname }) =>
                                          `${name} ${surname}`
                                      )
                                      .join(", ")
                                  : "Nenhum usuário foi vinculado"}
                              </td>
                            </Permission>
                            <Permission roles={["CONSULTOR"]}>
                              <td className="names" align="center">
                                {`${relUser?.name} ${relUser?.surname}`}
                              </td>
                            </Permission>
                            <Permission roles={["ESCOPO_FECHADO"]}>
                              <td align="center">
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
                              </td>
                            </Permission>
                            <Permission roles={["APROVADO_GP"]}>
                              <td align="center">
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
                              </td>
                            </Permission>
                            <Permission roles={["FATURAVEL"]}>
                              <td align="center">
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
                              </td>
                            </Permission>
                            <Permission roles={["LANCADO"]}>
                              <td align="center">
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
                              </td>
                            </Permission>
                            <Permission roles={["APROVADO"]}>
                              <td align="center">
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
                              </td>
                            </Permission>
                            <Permission roles={["DATA_SISTEMA_DATA_EDICAO"]}>
                              <td className="created-edit" align="center">
                                {`${generateDateWithTimestamp(
                                  createdAt
                                )} ${generateTimeWithTimestamp(
                                  createdAt
                                )} ${generateDateWithTimestamp(
                                  updatedAt
                                )} ${generateTimeWithTimestamp(updatedAt)}`}
                              </td>
                            </Permission>
                            <Permission
                              roles={["EDITAR_HORAS" || "DELETAR_HORAS"]}
                            >
                              <td align="center">
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
                              </td>
                            </Permission>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
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
    </div>
  );
}
