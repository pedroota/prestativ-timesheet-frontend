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
  Chip,
} from "@mui/material";
import { StyledTableCell } from "components/StyledTableCell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRole, getRoles } from "services/roles.service";
import { EmptyList } from "components/EmptyList";
import { StyledTableRow } from "components/StyledTableRow";
import { Delete, Edit } from "@mui/icons-material";
import { Roles } from "interfaces/roles.interface";
import { ModalCreateRole } from "./components/ModalCreateRole";
import { ModalEditRole } from "./components/ModalEditRole";
export function UserProfiles() {
  const queryClient = useQueryClient();
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [isAddingRole, setIsAddingRole] = useState(false);
  const { data: roles } = useQuery(["roles"], () => getRoles());

  // Delete role mutation
  const { mutate } = useMutation((_id: string) => deleteRole(_id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
    },
  });

  return (
    <section>
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
                        Controles
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles?.data.map(({ _id, name, permissions }: Roles) => (
                      <StyledTableRow key={_id}>
                        <StyledTableCell align="center">{name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {permissions.length ? (
                            permissions.map((permission) => (
                              <Chip
                                key={permission}
                                label={permission}
                                sx={{ marginInline: "0.25rem" }}
                              />
                            ))
                          ) : (
                            <p>
                              Não foram encontradas permissões para este perfil
                            </p>
                          )}
                        </StyledTableCell>
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
                          <Edit
                            onClick={() => {
                              setIsEditingRole((prevState) => !prevState);
                              setCurrentRole(_id);
                            }}
                          />
                          <Delete onClick={() => mutate(_id)} />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Paper>
          <ModalCreateRole isOpen={isAddingRole} setIsOpen={setIsAddingRole} />
          <ModalEditRole
            isOpen={isEditingRole}
            setIsOpen={setIsEditingRole}
            currentRole={currentRole}
          />
        </div>
      ) : (
        <EmptyList />
      )}
    </section>
  );
}
