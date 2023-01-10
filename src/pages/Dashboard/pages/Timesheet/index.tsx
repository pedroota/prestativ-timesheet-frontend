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

  return (
    <div>
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
                    {new Date(initial).toLocaleDateString()}
                    <br />
                    {new Date(initial).getHours() +
                      ":" +
                      new Date(initial).getMinutes()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(final).toLocaleDateString()}
                    <br />
                    {new Date(final).getHours() +
                      ":" +
                      new Date(final).getMinutes()}
                  </StyledTableCell>
                  <StyledTableCell align="center">total</StyledTableCell>
                  <StyledTableCell align="center">
                    {adjustment / 60 / 60 / 1000}
                  </StyledTableCell>
                  <StyledTableCell align="center">total ajuste</StyledTableCell>
                  <StyledTableCell align="center">{relClient}</StyledTableCell>
                  <StyledTableCell align="center">{relProject}</StyledTableCell>
                  <StyledTableCell align="center">
                    {relActivity}
                  </StyledTableCell>
                  <StyledTableCell align="center">{relUser}</StyledTableCell>
                  <StyledTableCell align="center">
                    {!closedScope ? <Checkbox /> : <Checkbox defaultChecked />}
                    {closedScope ? "sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {!billable ? <Checkbox /> : <Checkbox defaultChecked />}
                    {billable ? "sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {!released ? <Checkbox /> : <Checkbox defaultChecked />}
                    {released ? "sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {!approved ? <Checkbox /> : <Checkbox defaultChecked />}
                    {approved ? "sim" : "Não"}
                  </StyledTableCell>
                  <StyledTableCell align="center">{callNumber}</StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(createdAt).toLocaleDateString()}
                    <br />
                    {new Date(createdAt).getHours() +
                      ":" +
                      new Date(createdAt).getMinutes()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(updatedAt).toLocaleDateString()}
                    <br />
                    {new Date(updatedAt).getHours() +
                      ":" +
                      new Date(updatedAt).getMinutes()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <EditIcon />
                    <DeleteIcon
                      onClick={() => {
                        deleteHours(_id);
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              )
            )}
          </TableBody>
        </Table>
        <Button>Novo Lançamento</Button>
      </Paper>
    </div>
  );
}
