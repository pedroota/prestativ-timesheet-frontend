import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getAllUsers } from "services/auth.service";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserInfo } from "interfaces/users.interface";
import { EmptyList } from "components/EmptyList";
import { ModalEditUser } from "./components/ModalEditUser";

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
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const { data: users } = useQuery(["users"], () => getAllUsers());
  const queryClient = useQueryClient();

  // Delete user Mutation
  const { mutate } = useMutation((id: string) => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <div>
      <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
        Listagem de Usuários
      </Typography>
      {users?.data.length ? (
        <div>
          <Paper className="c-timesheet">
            <div className="c-table">
              <div className="c-table--helper">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Nome</StyledTableCell>
                      <StyledTableCell align="center">Email</StyledTableCell>
                      <StyledTableCell align="center">
                        Permissão
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Controles
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.data.map(
                      ({ name, surname, email, role, _id }: UserInfo) => (
                        <StyledTableRow key={_id}>
                          <StyledTableCell align="center">
                            {`${name} ${surname}`}
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            {email}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {role}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              display: "flex",
                              gap: "20px",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                            align="center"
                          >
                            <EditIcon
                              onClick={() => {
                                setCurrentUser(_id);
                                setIsEditingUser((prevState) => !prevState);
                              }}
                            />
                            <DeleteIcon onClick={() => mutate(_id)} />
                          </StyledTableCell>
                        </StyledTableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Paper>
          <ModalEditUser
            isOpen={isEditingUser}
            setIsOpen={setIsEditingUser}
            currentUser={currentUser}
          />
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
}
