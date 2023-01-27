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

interface ConsultantUsers {
  name: string;
  surname: string;
}

export function ListActivities() {
  const [currentActivity, setCurrentActivity] = useState("");
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const queryClient = useQueryClient();
  const { data: activities } = useQuery(["activities"], () => getActivities());

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
      {activities?.data.length ? (
        <div>
          <Paper className="c-timesheet">
            <div className="c-table">
              <div className="c-table--helper">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow className="c-table--reset-head">
                      <StyledTableCell align="center">Titulo</StyledTableCell>
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
                        Controles
                      </StyledTableCell>
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
                            {formatCurrency(valueActivity)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {`${gpActivity?.name} ${gpActivity?.surname}`}
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
                            <EditIcon
                              onClick={() => {
                                setCurrentActivity(_id);
                                setIsEditingActivity((prevState) => !prevState);
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

          <ModalEditActivity
            isOpen={isEditingActivity}
            setIsOpen={setIsEditingActivity}
            currentActivity={currentActivity}
          />
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
}
