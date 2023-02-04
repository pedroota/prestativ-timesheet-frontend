import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteActivity, getActivities } from "services/activities.service";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { EmptyList } from "components/EmptyList";
import { formatCurrency } from "utils/formatCurrency";
import { ModalEditActivity } from "./components/ModalEditActivity";
import Checkbox from "@mui/material/Checkbox";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";

interface ConsultantUsers {
  name: string;
  surname: string;
}

export function ListActivities() {
  const [currentActivity, setCurrentActivity] = useState("");
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const queryClient = useQueryClient();
  const { data: activities, isLoading } = useQuery(["activities"], () =>
    getActivities()
  );

  // Delete Activity Mutation
  const { mutate } = useMutation((id: string) => deleteActivity(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["activities"]);
    },
  });

  return (
    <div>
      <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
        Listagem de Atividades
      </Typography>
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
          {activities?.data.length ? (
            <div>
              <Paper className="c-timesheet">
                <div className="c-table">
                  <div className="c-table--helper">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow className="c-table--reset-head">
                          <StyledTableCell align="center">
                            Titulo
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Projeto Relacionado
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Valor Atividade
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Gerente de Projetos
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Descrição
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Usuários Vinculados
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Escopo Fechado
                          </StyledTableCell>
                          <Permission
                            roles={["EDITAR_ATIVIDADE" || "DELETAR_ATIVIDADE"]}
                          >
                            <StyledTableCell align="center">
                              Controles
                            </StyledTableCell>
                          </Permission>
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
                            users,
                            closedScope,
                          }: ActivitiesInfo) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {title}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {project?.title}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {valueActivity
                                  ? formatCurrency(valueActivity)
                                  : "Sem Valor"}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {gpActivity
                                  ? `${gpActivity?.name} ${gpActivity?.surname}`
                                  : "nenhum"}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {description}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {users.map(
                                  ({ name, surname }: ConsultantUsers) =>
                                    `${name} ${surname}`
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {!closedScope ? (
                                  <Checkbox />
                                ) : (
                                  <Checkbox defaultChecked />
                                )}
                              </StyledTableCell>
                              <Permission
                                roles={[
                                  "EDITAR_ATIVIDADE" || "DELETAR_ATIVIDADE",
                                ]}
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
                                  <Permission roles={["EDITAR_ATIVIDADE"]}>
                                    <EditIcon
                                      onClick={() => {
                                        setCurrentActivity(_id);
                                        setIsEditingActivity(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
                                  <Permission roles={["DELETAR_ATIVIDADE"]}>
                                    <DeleteIcon onClick={() => mutate(_id)} />
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
              <Permission roles={["EDITAR_ATIVIDADE"]}>
                <ModalEditActivity
                  isOpen={isEditingActivity}
                  setIsOpen={setIsEditingActivity}
                  currentActivity={currentActivity}
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
