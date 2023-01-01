import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";

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

const rows = [
  {
    id: 1,
    date: "09/12",
    day: "SEX",
    startDate: "15:00",
    endDate: "17:00",
    hours: "2h",
    client: "Multilaser",
    project: "Projeto XYZ",
    activity: "Atividade Barbada que demorei demais e virou bola de neve",
    approved: "Em andamento",
  },
  {
    id: 2,
    date: "09/12",
    day: "SEX",
    startDate: "15:00",
    endDate: "17:00",
    hours: "2h",
    client: "Multilaser",
    project: "Projeto XYZ",
    activity: "Atividade Barbada que demorei demais e virou bola de neve",
    approved: "Em andamento",
  },
];

export function Timesheet() {
  return (
    <Paper className="c-timesheet">
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Data</StyledTableCell>
            <StyledTableCell align="center">Dia</StyledTableCell>
            <StyledTableCell align="center">Início</StyledTableCell>
            <StyledTableCell align="center">Fim</StyledTableCell>
            <StyledTableCell align="center">Horas</StyledTableCell>
            <StyledTableCell align="center">Cliente</StyledTableCell>
            <StyledTableCell align="center">Projeto</StyledTableCell>
            <StyledTableCell align="center">Atividade</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">{row.day}</StyledTableCell>
              <StyledTableCell align="center">{row.startDate}</StyledTableCell>
              <StyledTableCell align="center">{row.endDate}</StyledTableCell>
              <StyledTableCell align="center">{row.hours}</StyledTableCell>
              <StyledTableCell align="center">{row.client}</StyledTableCell>
              <StyledTableCell align="center">{row.project}</StyledTableCell>
              <StyledTableCell align="center">{row.activity}</StyledTableCell>
              <StyledTableCell align="center">{row.approved}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
