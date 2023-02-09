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
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
} from "utils/timeControl";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { EmptyList } from "components/EmptyList";
import { formatCurrency } from "utils/formatCurrency";
import { ModalEditActivity } from "./components/ModalEditActivity";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";
import Chip from "@mui/material/Chip";
import { SwitchIOS } from "components/SwitchIOS";

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
                          <StyledTableCell align="center">
                            Validade da Atividade
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
                            activityValidity,
                          }: ActivitiesInfo) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {title}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {`${project?.title} (Cliente: ${project?.idClient.name})`}
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
                                {users.length ? (
                                  users.map(
                                    ({ name, surname }: ConsultantUsers) => (
                                      <Chip
                                        key={name}
                                        label={`${name} ${surname}`}
                                        sx={{ margin: "0.25rem" }}
                                      />
                                    )
                                  )
                                ) : (
                                  <p>Nenhum usuário foi vinculado</p>
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={closedScope}
                                  disabled={false}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {activityValidity
                                  ? `${generateDateWithTimestamp(
                                      activityValidity
                                    )} ${generateTimeWithTimestamp(
                                      activityValidity
                                    )}`
                                  : "não definido"}
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
