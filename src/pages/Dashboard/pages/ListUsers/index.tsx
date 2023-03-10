import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "services/auth.service";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserInfo } from "interfaces/users.interface";
import { EmptyList } from "components/EmptyList";
import { ModalEditUser } from "./components/ModalEditUser";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";
import { ModalRegisterUser } from "./components/ModalRegisterUser";
import { ModalDeleteUser } from "./components/ModalDeleteUser";

export function ListUsers() {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const { data: users, isLoading } = useQuery(["users"], () => getAllUsers());

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
          Usuários
        </Typography>
        <Permission roles={["CADASTRO_USUARIO"]}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setIsAddingUser((prevState) => !prevState)}
          >
            Cadastrar usuário
          </Button>
        </Permission>
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
          {users?.data.length ? (
            <div>
              <Paper className="c-timesheet">
                <div className="c-table">
                  <div className="c-table--helper">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Nome</StyledTableCell>
                          <StyledTableCell align="center">
                            Email
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Campo Cadastral
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Perfil
                          </StyledTableCell>
                          <Permission
                            roles={["EDITAR_USUARIO" || "DELETAR_USUARIO"]}
                          >
                            <StyledTableCell align="center">
                              Controles
                            </StyledTableCell>
                          </Permission>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users?.data.map(
                          ({
                            name,
                            surname,
                            email,
                            role,
                            typeField,
                            _id,
                          }: UserInfo) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {`${name} ${surname}`}
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                {email}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {typeField == "consultor"
                                  ? "Consultor"
                                  : typeField == "gerenteprojetos"
                                  ? "Gerente de Projetos"
                                  : "Não se Aplica"}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {role.name}
                              </StyledTableCell>
                              <Permission
                                roles={["EDITAR_USUARIO" || "DELETAR_USUARIO"]}
                              >
                                <StyledTableCell
                                  sx={{
                                    display: "flex",
                                    gap: "20px",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                  }}
                                  align="center"
                                >
                                  <Permission roles={["EDITAR_USUARIO"]}>
                                    <EditIcon
                                      onClick={() => {
                                        setCurrentUser(_id);
                                        setIsEditingUser(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
                                  <Permission roles={["DELETAR_USUARIO"]}>
                                    <DeleteIcon
                                      onClick={() => {
                                        setCurrentUser(_id);
                                        setIsDeletingUser(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
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
              <Permission roles={["EDITAR_USUARIO"]}>
                <ModalEditUser
                  isOpen={isEditingUser}
                  setIsOpen={setIsEditingUser}
                  currentUser={currentUser}
                />
              </Permission>
              <Permission roles={["CADASTRO_USUARIO"]}>
                <ModalRegisterUser
                  isOpen={isAddingUser}
                  setIsOpen={setIsAddingUser}
                />
              </Permission>
              <Permission roles={["DELETAR_USUARIO"]}>
                <ModalDeleteUser
                  isOpen={isDeletingUser}
                  setIsOpen={setIsDeletingUser}
                  currentUser={currentUser}
                />
              </Permission>
            </div>
          ) : (
            <EmptyList />
          )}
        </>
      )}
    </div>
  );
}
