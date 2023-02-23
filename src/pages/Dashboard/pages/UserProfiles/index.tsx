import { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { StyledTableCell } from "components/StyledTableCell";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "services/roles.service";
import { EmptyList } from "components/EmptyList";
import { StyledTableRow } from "components/StyledTableRow";
import { Delete, Edit } from "@mui/icons-material";
import { Roles } from "interfaces/roles.interface";
import { ModalCreateRole } from "./components/ModalCreateRole";
import { ModalEditRole } from "./components/ModalEditRole";
import { Permission } from "components/Permission";
import { ModalDeleteRole } from "./components/ModalDeleteRole";
import { getAllUsers } from "services/auth.service";
export function UserProfiles() {
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [isAddingRole, setIsAddingRole] = useState(false);
  const { data: roles } = useQuery(["roles"], () => getRoles());
  const { data: users } = useQuery(["users"], () => getAllUsers());
  console.log(users);
  return (
    <Permission roles={["PERFIS_USUARIO"]}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
          Perfis de Usuário
        </Typography>
        <Permission roles={["CRIAR_PERFIL"]}>
          <Tooltip title="Criar novo perfil" arrow placement="top">
            <Button
              onClick={() => setIsAddingRole((prevState) => !prevState)}
              variant="contained"
              color="warning"
              sx={{
                marginBottom: "0.8rem",
                paddingInline: "1rem",
                paddingBlock: "0.8rem",
              }}
            >
              Criar perfil
            </Button>
          </Tooltip>
        </Permission>
      </Box>
      {roles?.data.length ? (
        <div>
          <Paper>
            <div className="c-table">
              <div className="c-table--helper">
                <Table className="c-table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Nome</StyledTableCell>
                      <StyledTableCell align="center">
                        Permissões
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Quantidade de Usuários
                      </StyledTableCell>
                      <Permission roles={["EDITAR_PERFIL" || "DELETAR_PERFIL"]}>
                        <StyledTableCell align="center">
                          Controles
                        </StyledTableCell>
                      </Permission>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles?.data.map(({ _id, name, permissions }: Roles) => (
                      <StyledTableRow key={_id}>
                        <StyledTableCell align="center">{name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {permissions.length === 52 ? (
                            <p>Este perfil possui todas as permissões</p>
                          ) : permissions.length ? (
                            permissions.length === 1 ? (
                              <p>Foi encontrada 1 permissão para este perfil</p>
                            ) : (
                              <p>
                                Foram encontradas {permissions.length}{" "}
                                permissões para este perfil
                              </p>
                            )
                          ) : (
                            <p>
                              Não foram encontradas permissões para este perfil
                            </p>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {users?.data.filter(
                            (user: { data: { role: { name: string } } }) =>
                              user.role.name === name
                          ).length ? (
                            users?.data.filter(
                              (user: { data: { role: { name: string } } }) =>
                                user.role.name === name
                            ).length === 1 ? (
                              <p>Este perfil possui 1 usuário vinculado</p>
                            ) : (
                              <p>
                                Este perfil possui{" "}
                                {
                                  users?.data.filter(
                                    (user: {
                                      data: { role: { name: string } };
                                    }) => user.role.name === name
                                  ).length
                                }{" "}
                                usuários vinculados
                              </p>
                            )
                          ) : (
                            <p>
                              Não foram encontrados usuários vinculados a este
                              perfil
                            </p>
                          )}
                        </StyledTableCell>
                        <Permission
                          roles={["EDITAR_PERFIL" || "DELETAR_PERFIL"]}
                        >
                          <StyledTableCell
                            sx={{
                              display: "flex",
                              gap: "20px",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            align="center"
                          >
                            <Permission roles={["EDITAR_PERFIL"]}>
                              <Edit
                                onClick={() => {
                                  setIsEditingRole((prevState) => !prevState);
                                  setCurrentRole(_id);
                                }}
                              />
                            </Permission>
                            <Permission roles={["DELETAR_PERFIL"]}>
                              <Delete
                                onClick={() => {
                                  setIsDeletingRole((prevState) => !prevState);
                                  setCurrentRole(_id);
                                }}
                              />
                            </Permission>
                          </StyledTableCell>
                        </Permission>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Paper>
          <Permission roles={["CRIAR_PERFIL"]}>
            <ModalCreateRole
              isOpen={isAddingRole}
              setIsOpen={setIsAddingRole}
            />
          </Permission>
          <Permission roles={["EDITAR_PERFIL"]}>
            <ModalEditRole
              isOpen={isEditingRole}
              setIsOpen={setIsEditingRole}
              currentRole={currentRole}
            />
          </Permission>
          <Permission roles={["DELETAR_PERFIL"]}>
            <ModalDeleteRole
              isOpen={isDeletingRole}
              setIsOpen={setIsDeletingRole}
              currentRole={currentRole}
            />
          </Permission>
        </div>
      ) : (
        <EmptyList />
      )}
    </Permission>
  );
}
