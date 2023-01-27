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
export function UserProfiles() {
  const queryClient = useQueryClient();
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
          Listagem de Cargos
        </Typography>
        <Tooltip title="Criar novo cargo" arrow placement="top">
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
            Criar cargo
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
                              Não foram encontradas permissões para este cargo
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
                          <Edit />
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
        </div>
      ) : (
        <EmptyList />
      )}
    </section>
  );
}
