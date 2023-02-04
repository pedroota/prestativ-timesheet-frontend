import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  checkHours,
  deleteHours,
  getHoursFilters,
} from "services/hours.service";
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
import { Hours, PatchHour } from "interfaces/hours.interface";
import { ModalRegisterHours } from "components/ModalRegisterHours";
import { EmptyList } from "components/EmptyList";
import { StyledTableRow } from "components/StyledTableRow";
import { StyledTableCell } from "components/StyledTableCell";
import { updateClosedEscope } from "services/activities.service";

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

export function Timesheet() {
  const queryClient = useQueryClient();
  const [isEditingHour, setIsEditingHour] = useState(false);
  const [currentHour, setCurrentHour] = useState("");
  const [isAddingHours, setIsAddingHours] = useState(false);
  const [stringFilters, setStringFilters] = useState("");
  const { data: hours, isLoading } = useQuery(["hours", stringFilters], () =>
    getHoursFilters(stringFilters)
  );

  const { mutate: deleteHour } = useMutation(
    (_id: string) => deleteHours(_id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hours"]);
      },
    }
  );

  const { mutate: updateCheck } = useMutation(
    ({ _id, field, value }: PatchHour) => checkHours(_id, field, value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hours"]);
      },
    }
  );

  const { mutate: updateEscope } = useMutation(
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

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
          Timesheet
        </Typography>
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
      <Filters receiveDataURI={receiveDataURI} />
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
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
          {hours?.data.length ? (
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
                          <StyledTableCell align="center">
                            Dia da Semana
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["HORA_INICIAL"]}>
                          <StyledTableCell align="center">
                            Hora Inicial
                          </StyledTableCell>
                        </Permission>
                        <Permission roles={["HORA_FINAL"]}>
                          <StyledTableCell align="center">
                            Hora Final
                          </StyledTableCell>
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
                      {hours?.data.map(
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
                                {relClient?.name}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["PROJETO"]}>
                              <StyledTableCell align="center">
                                {relProject?.title}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["ATIVIDADE"]}>
                              <StyledTableCell align="center">
                                {relActivity?.title}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["VALOR"]}>
                              <StyledTableCell align="center">
                                {relActivity.valueActivity
                                  ? relActivity.valueActivity
                                  : relProject.valueProject
                                  ? relProject.valueProject
                                  : relClient.valueClient}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["GERENTE_DE_PROJETOS"]}>
                              <StyledTableCell align="center">
                                {(relActivity.gpActivity
                                  ? relActivity.gpActivity
                                  : relProject.gpProject
                                  ? relProject.gpProject
                                  : relClient.gpClient
                                ).slice(0, 5)}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["CONSULTOR"]}>
                              <StyledTableCell align="center">
                                {`${relUser?.name} ${relUser?.surname}`}
                              </StyledTableCell>
                            </Permission>
                            <Permission roles={["ESCOPO_FECHADO"]}>
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={relActivity?.closedScope}
                                  onChange={() =>
                                    updateEscope({
                                      _id: relActivity._id,
                                      value: !relActivity?.closedScope,
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
                                  defaultChecked={approved}
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
                                approved ? null : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "20px",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                  >
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
                                          deleteHour(_id);
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
    </div>
  );
}
