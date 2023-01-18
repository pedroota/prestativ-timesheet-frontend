import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteHours, getHours } from "services/hours.service";
import {
  Table,
  styled,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Hours } from "interfaces/hours.interface";
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateTotalHoursWithAdjustment,
} from "utils/timeControl";
import { ModalRegisterHours } from "components/ModalRegisterHours";
import { EmptyList } from "components/EmptyList";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function Timesheet() {
  const [isAddingHours, setIsAddingHours] = useState(false);
  const { data: hours } = useQuery(["hours"], () => getHours());

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
      {hours?.data.lenght > 0 ? (
        <Paper className="c-timesheet">
          <div className="c-table">
            <div className="c-table--helper">
              <Table className="c-table" aria-label="customized table">
                <TableHead>
                  <TableRow className="c-table--reset-head">
                    <StyledTableCell align="center">
                      Horário Inicial
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Horário Final
                    </StyledTableCell>
                    <StyledTableCell align="center">Total</StyledTableCell>
                    <StyledTableCell align="center">Ajuste</StyledTableCell>
                    <StyledTableCell align="center">
                      Total c/ Ajuste
                    </StyledTableCell>
                    <StyledTableCell align="center">Cliente</StyledTableCell>
                    <StyledTableCell align="center">Projeto</StyledTableCell>
                    <StyledTableCell align="center">Atividade</StyledTableCell>
                    <StyledTableCell align="center">Consultor</StyledTableCell>
                    <StyledTableCell align="center">
                      Escopo Fechado
                    </StyledTableCell>
                    <StyledTableCell align="center">Faturável</StyledTableCell>
                    <StyledTableCell align="center">Lançado</StyledTableCell>
                    <StyledTableCell align="center">Aprovado</StyledTableCell>
                    <StyledTableCell align="center">
                      Número do Chamado
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Data Sistema
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Data Edição
                    </StyledTableCell>
                    <StyledTableCell align="center">Controles</StyledTableCell>
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
                      closedScope,
                      billable,
                      released,
                      approved,
                      callNumber,
                      createdAt,
                      updatedAt,
                    }: Hours) => (
                      <StyledTableRow key={_id}>
                        <StyledTableCell align="center">
                          {`${generateDateWithTimestamp(
                            initial
                          )} ${generateTimeWithTimestamp(
                            initial
                          )} ${generateDayWeekWithTimestamp(initial)}`}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {`${generateDateWithTimestamp(
                            final
                          )} ${generateTimeWithTimestamp(
                            final
                          )} ${generateDayWeekWithTimestamp(final)}`}
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
                          {relClient}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {relProject}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {relActivity}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {relUser}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {!closedScope ? (
                            <Checkbox />
                          ) : (
                            <Checkbox defaultChecked />
                          )}
                          {closedScope ? "Sim" : "Não"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {!billable ? (
                            <Checkbox />
                          ) : (
                            <Checkbox defaultChecked />
                          )}
                          {billable ? "Sim" : "Não"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {!released ? (
                            <Checkbox />
                          ) : (
                            <Checkbox defaultChecked />
                          )}
                          {released ? "Sim" : "Não"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {!approved ? (
                            <Checkbox />
                          ) : (
                            <Checkbox defaultChecked />
                          )}
                          {approved ? "Sim" : "Não"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {callNumber}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {generateDateWithTimestamp(createdAt)}
                          {generateTimeWithTimestamp(createdAt)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {generateDateWithTimestamp(updatedAt)}
                          {generateTimeWithTimestamp(updatedAt)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {closedScope || billable || released || approved ? (
                            " "
                          ) : (
                            <div>
                              <EditIcon />
                              <DeleteIcon
                                onClick={() => {
                                  deleteHours(_id);
                                }}
                              />
                            </div>
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
      <ModalRegisterHours isOpen={isAddingHours} setIsOpen={setIsAddingHours} />
    </div>
  );
}
