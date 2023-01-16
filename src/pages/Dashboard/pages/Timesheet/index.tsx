import { useQuery } from "@tanstack/react-query";
import { deleteHours, getHours } from "services/hours.service";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Hours } from "interfaces/hours.interface";
import { Button, Checkbox } from "@mui/material";
import { useState } from "react";
import { NewHourRow } from "components/NewHourRow";
import { Filters } from "components/Filters";
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateTotalHoursWithAdjustment,
} from "utils/timeControl";

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
  const { data: hours } = useQuery(["hours"], () => getHours());
  const [addNew, setAddNew] = useState(false);

  return (
    <div>
      <Filters />
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
                  <StyledTableCell align="center">Data Sistema</StyledTableCell>
                  <StyledTableCell align="center">Data Edição</StyledTableCell>
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
                        {generateAdjustmentWithNumberInMilliseconds(adjustment)}
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
                        {!billable ? <Checkbox /> : <Checkbox defaultChecked />}
                        {billable ? "Sim" : "Não"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {!released ? <Checkbox /> : <Checkbox defaultChecked />}
                        {released ? "Sim" : "Não"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {!approved ? <Checkbox /> : <Checkbox defaultChecked />}
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
                {addNew && <NewHourRow />}
              </TableBody>
            </Table>
          </div>
        </div>
        {!addNew && (
          <Button
            onClick={() => {
              setAddNew(true);
            }}
          >
            Novo Lançamento
          </Button>
        )}
      </Paper>
    </div>
  );
}
