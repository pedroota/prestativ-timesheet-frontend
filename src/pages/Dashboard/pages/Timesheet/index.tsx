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

  function generateDateWithTimestamp(timestamp: number) {
    return new Date(timestamp).toLocaleDateString();
  }

  function generateTimeWithTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    const hours =
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hours + ":" + minutes;
  }

  function generateDayWeekWithTimestamp(timestamp: number) {
    const option: any = { weekday: "short" };
    const locale = "pt-br";
    return new Date(timestamp)
      .toLocaleDateString(locale, option)
      .toUpperCase()
      .slice(0, -1);
  }

  function generateTotalHours(initial: number, final: number) {
    let hours = Math.trunc((final - initial) / 60 / 60 / 1000);
    let minutes = ((final - initial) / 60 / 1000) % 60;
    if (hours > 60) {
      minutes = hours % 60;
      hours = Math.trunc(hours / 60);
    }
    return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
  }

  function generateAdjustmentWithNumberInMilliseconds(number: number) {
    if (!number) {
      return "0";
    }
    let hours = Math.trunc(number / 60 / 60 / 60 / 1000);
    let minutes = (number / 60 / 60 / 1000) % 60;
    if (hours > 60) {
      minutes = hours % 60;
      hours = Math.trunc(hours / 60);
    }
    return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
    // 3600000 equivale a um minuto
  }

  function generateTotalHoursWithAdjustment(
    initial: number,
    final: number,
    adjustment: number
  ) {
    if (!adjustment) {
      return generateTotalHours(initial, final);
    } else {
      return generateTotalHours(initial, final + adjustment / 60);
    }
  }

  return (
    <div>
      <Filters />
      {/* Quando adiciona uma nova linha não é para a tabela ficar mudando de tamanho */}
      <Paper className="c-timesheet">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                Horário
                <br />
                Inicial
              </StyledTableCell>
              <StyledTableCell align="center">
                Horário
                <br />
                Final
              </StyledTableCell>
              <StyledTableCell align="center">Total</StyledTableCell>
              <StyledTableCell align="center">Ajuste</StyledTableCell>
              <StyledTableCell align="center">
                Total
                <br />
                c/ Ajuste
              </StyledTableCell>
              <StyledTableCell align="center">Cliente</StyledTableCell>
              <StyledTableCell align="center">Projeto</StyledTableCell>
              <StyledTableCell align="center">Atividade</StyledTableCell>
              <StyledTableCell align="center">Consultor</StyledTableCell>
              <StyledTableCell align="center">
                Escopo
                <br />
                Fechado
              </StyledTableCell>
              <StyledTableCell align="center">Faturável</StyledTableCell>
              <StyledTableCell align="center">Lançado</StyledTableCell>
              <StyledTableCell align="center">Aprovado</StyledTableCell>
              <StyledTableCell align="center">
                Número do
                <br />
                Chamado
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
                    {generateDateWithTimestamp(initial)}
                    <br />
                    {generateTimeWithTimestamp(initial)}
                    <br />
                    {generateDayWeekWithTimestamp(initial)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {generateDateWithTimestamp(final)}
                    <br />
                    {generateTimeWithTimestamp(final)}
                    <br />
                    {generateDayWeekWithTimestamp(final)}
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
                  <StyledTableCell align="center">{relClient}</StyledTableCell>
                  <StyledTableCell align="center">{relProject}</StyledTableCell>
                  <StyledTableCell align="center">
                    {relActivity}
                  </StyledTableCell>
                  <StyledTableCell align="center">{relUser}</StyledTableCell>
                  <StyledTableCell align="center">
                    {!closedScope ? <Checkbox /> : <Checkbox defaultChecked />}
                    <br />
                    {closedScope ? "Sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {!billable ? <Checkbox /> : <Checkbox defaultChecked />}
                    <br />
                    {billable ? "Sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {!released ? <Checkbox /> : <Checkbox defaultChecked />}
                    <br />
                    {released ? "Sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {!approved ? <Checkbox /> : <Checkbox defaultChecked />}
                    <br />
                    {approved ? "Sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">{callNumber}</StyledTableCell>
                  <StyledTableCell align="center">
                    {generateDateWithTimestamp(createdAt)}
                    <br />
                    {generateTimeWithTimestamp(createdAt)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {generateDateWithTimestamp(updatedAt)}
                    <br />
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
