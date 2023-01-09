import { useQuery } from "@tanstack/react-query";
import { deleteActivity, getActivities } from "services/activities.service";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ActivitiesInfo } from "interfaces/activities.interface";

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

export function ListActivities() {
  const { data: activities } = useQuery(["activities"], () => getActivities());

  return (
    <div>
      <h1>Listagem de Atividades</h1>
      <Paper className="c-timesheet">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Titulo</StyledTableCell>
              <StyledTableCell align="center">
                Projeto Relacionado
              </StyledTableCell>
              <StyledTableCell align="center">Valor Atividade</StyledTableCell>
              <StyledTableCell align="center">
                Gerente de Projetos
              </StyledTableCell>
              <StyledTableCell align="center">Descrição</StyledTableCell>
              <StyledTableCell align="center">
                Usuários Vinculados
              </StyledTableCell>
              <StyledTableCell align="center">Controles</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities?.data.map(
              ({
                _id,
                title,
                project,
                valueActivity,
                gpActivity,
                description,
                userString,
              }: ActivitiesInfo) => (
                <StyledTableRow key={_id}>
                  <StyledTableCell align="center">{title}</StyledTableCell>
                  <StyledTableCell align="center">{project}</StyledTableCell>
                  <StyledTableCell align="center">
                    {valueActivity}
                  </StyledTableCell>
                  <StyledTableCell align="center">{gpActivity}</StyledTableCell>
                  <StyledTableCell align="center">
                    {description}
                  </StyledTableCell>
                  <StyledTableCell align="center">{userString}</StyledTableCell>
                  <StyledTableCell align="center">
                    <EditIcon />
                    <DeleteIcon
                      onClick={() => {
                        deleteActivity(_id);
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              )
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
