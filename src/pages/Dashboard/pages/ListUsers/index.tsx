import { useQuery } from "@tanstack/react-query";
import { deleteUser, getAllUsers } from "services/auth.service";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserInfo } from "interfaces/users.interface";

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

export function ListUsers() {
  const { data: users } = useQuery(["users"], () => getAllUsers());

  return (
    <div>
      <h1>Listagem de Usuários</h1>
      <Paper className="c-timesheet">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Nome</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Permissão</StyledTableCell>
              <StyledTableCell align="center">Controles</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.data.map(
              ({ name, surname, email, role, _id }: UserInfo) => (
                <StyledTableRow key={_id}>
                  <StyledTableCell align="center">
                    {`${name} ${surname}`}
                  </StyledTableCell>

                  <StyledTableCell align="center">{email}</StyledTableCell>
                  <StyledTableCell align="center">{role}</StyledTableCell>
                  <StyledTableCell align="center">
                    <EditIcon />
                    <DeleteIcon
                      onClick={() => {
                        deleteUser(_id);
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
