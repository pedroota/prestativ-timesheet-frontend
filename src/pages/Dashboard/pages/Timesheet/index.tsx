import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteHours, getHours } from "services/hours.service";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Typography,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Hours } from "interfaces/hours.interface";
import { ModalRegisterHours } from "components/ModalRegisterHours";
import { EmptyList } from "components/EmptyList";
import { StyledTableRow } from "components/StyledTableRow";
import { StyledTableCell } from "components/StyledTableCell";

// Utils
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateTotalHoursWithAdjustment,
} from "utils/timeControl";

export function Timesheet() {
  const queryClient = useQueryClient();
  const [isAddingHours, setIsAddingHours] = useState(false);
  const { data: hours, isLoading } = useQuery(["hours"], () => getHours());

  const { mutate } = useMutation((_id: string) => deleteHours(_id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["hours"]);
    },
  });

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
          Listagem de Timesheet
        </Typography>
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
      </Box>
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
                        <StyledTableCell align="center">Data</StyledTableCell>
                        <StyledTableCell align="center">
                          Dia da Semana
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Hora Inicial
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Hora Final
                        </StyledTableCell>
                        <StyledTableCell align="center">Total</StyledTableCell>
                        <StyledTableCell align="center">Ajuste</StyledTableCell>
                        <StyledTableCell align="center">
                          Total c/ Ajuste
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Cliente
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Projeto
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Atividade
                        </StyledTableCell>
                        <StyledTableCell align="center">Valor</StyledTableCell>
                        <StyledTableCell align="center">
                          Gerente de Projetos
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Consultor
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Escopo Fechado
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Aprovado GP
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Faturável
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Lançado
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Aprovado
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Descrição da Atividade
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Data Sistema / Data Edição
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Controles
                        </StyledTableCell>
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
                          activityDesc,
                          createdAt,
                          updatedAt,
                        }: Hours) => (
                          <StyledTableRow key={_id}>
                            <StyledTableCell align="center">
                              {generateDateWithTimestamp(initial)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {generateDayWeekWithTimestamp(initial)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {generateTimeWithTimestamp(initial)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {generateTimeWithTimestamp(final)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {generateTotalHours(initial, final)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {generateAdjustmentWithNumberInMilliseconds(
                                adjustment
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {generateTotalHoursWithAdjustment(
                                initial,
                                final,
                                adjustment
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {relClient?.name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {relProject?.title}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {relActivity?.title}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              valor
                            </StyledTableCell>
                            <StyledTableCell align="center">GP</StyledTableCell>
                            <StyledTableCell align="center">
                              {`${relUser?.name} ${relUser?.surname}`}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {!approvedGP ? (
                                // closedScope from collection activity must go here
                                <Checkbox />
                              ) : (
                                <Checkbox defaultChecked />
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {!approvedGP ? (
                                <Checkbox />
                              ) : (
                                <Checkbox defaultChecked />
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {!billable ? (
                                <Checkbox />
                              ) : (
                                <Checkbox defaultChecked />
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {!released ? (
                                <Checkbox />
                              ) : (
                                <Checkbox defaultChecked />
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {!approved ? (
                                <Checkbox />
                              ) : (
                                <Checkbox defaultChecked />
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {activityDesc}
                              {/* deve ser alterado para DESCRIÇÃO DA ATIVIDADE */}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {`${generateDateWithTimestamp(
                                createdAt
                              )} ${generateTimeWithTimestamp(
                                createdAt
                              )} ${generateDateWithTimestamp(
                                updatedAt
                              )} ${generateTimeWithTimestamp(updatedAt)}`}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {/* closed scope abaixo deve ser alterado para APROVADO GP na condicional */}
                              {approvedGP ||
                              billable ||
                              released ||
                              approved ? (
                                " "
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
                                  <EditIcon />
                                  <DeleteIcon
                                    onClick={() => {
                                      mutate(_id);
                                    }}
                                  />
                                </Box>
                              )}
                            </StyledTableCell>
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

      <ModalRegisterHours isOpen={isAddingHours} setIsOpen={setIsAddingHours} />
    </div>
  );
}
