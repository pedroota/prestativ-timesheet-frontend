import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getActivities,
  updateActivityValidity,
  updateClosedEscope,
} from "services/activities.service";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
} from "utils/timeControl";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  ActivitiesInfo,
  PatchActivities,
  PatchActivityValidity,
} from "interfaces/activities.interface";
import { EmptyList } from "components/EmptyList";
import { formatCurrency } from "utils/formatCurrency";
import { ModalEditActivity } from "./components/ModalEditActivity";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";
import Chip from "@mui/material/Chip";
import { SwitchIOS } from "components/SwitchIOS";
import { ModalRegisterActivity } from "./components/ModalRegisterActivity";
import { ModalDeleteActivity } from "./components/ModalDeleteActivity";
import { toast } from "react-toastify";

interface ConsultantUsers {
  name: string;
  surname: string;
}

export function ListActivities() {
  const queryClient = useQueryClient();
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [switchValidity, setSwitchValidity] = useState(false);
  const [currentActivity, setCurrentActivity] = useState("");
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [isDeletingActivity, setIsDeletingActivity] = useState(false);
  const { data: activities, isLoading } = useQuery(
    ["activities", switchValidity],
    () => getActivities()
  );

  const { mutate: updateEscope, isLoading: updatingEscope } = useMutation(
    ({ _id, value }: PatchActivities) => updateClosedEscope(_id, value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activities"]);
      },
    }
  );

  const { mutate: disableActivity, isLoading: disablingActivity } = useMutation(
    async ({ idActivity, activityValidity }: PatchActivityValidity) =>
      validadeOrInvalidate(idActivity, activityValidity),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activities"]);
        setSwitchValidity(!switchValidity);
        toast.success("Validade Atualizada.", {
          autoClose: 500,
        });
      },
      onError: () => {
        toast.error("Erro ao tentar atualizar a Validade.", {
          autoClose: 1000,
        });
      },
    }
  );

  const validadeOrInvalidate = (
    idActivity: string,
    activityValidity: number
  ) => {
    setCurrentActivity(idActivity);
    if (activityValidity >= Date.now()) {
      updateActivityValidity(idActivity, Date.now());
    } else {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const validity = date.getTime();
      updateActivityValidity(idActivity, validity);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
          Listagem de Atividades
        </Typography>
        <Permission roles={["CADASTRO_ATIVIDADE"]}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setIsAddingActivity((prevState) => !prevState)}
          >
            Criar atividade
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
                          <StyledTableCell
                            sx={{ display: "none" }}
                            align="center"
                          >
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
                          <StyledTableCell align="center">
                            Habilitar / Desabilitar
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
                              <StyledTableCell
                                sx={{ display: "none" }}
                                align="center"
                              >
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
                                  disabled={updatingEscope}
                                  onChange={() =>
                                    updateEscope({
                                      _id: _id,
                                      value: !closedScope,
                                    })
                                  }
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
                              <StyledTableCell align="center">
                                <SwitchIOS
                                  color="warning"
                                  checked={activityValidity >= Date.now()}
                                  disabled={disablingActivity}
                                  onChange={() =>
                                    disableActivity({
                                      idActivity: _id,
                                      activityValidity: activityValidity,
                                    })
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
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
                                    <DeleteIcon
                                      onClick={() => {
                                        setCurrentActivity(_id);
                                        setIsDeletingActivity(
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
              <Permission roles={["EDITAR_ATIVIDADE"]}>
                <ModalEditActivity
                  isOpen={isEditingActivity}
                  setIsOpen={setIsEditingActivity}
                  currentActivity={currentActivity}
                />
              </Permission>
              <Permission roles={["DELETAR_ATIVIDADE"]}>
                <ModalDeleteActivity
                  isOpen={isDeletingActivity}
                  setIsOpen={setIsDeletingActivity}
                  currentActivity={currentActivity}
                />
              </Permission>
            </div>
          ) : (
            <EmptyList />
          )}
          <Permission roles={["CADASTRO_ATIVIDADE"]}>
            <ModalRegisterActivity
              isOpen={isAddingActivity}
              setIsOpen={setIsAddingActivity}
            />
          </Permission>
        </>
      )}
    </div>
  );
}
