import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProject, getProjects } from "services/project.service";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { ProjectsInfo } from "interfaces/projects.interface";
import { EmptyList } from "components/EmptyList";
import { formatCurrency } from "utils/formatCurrency";
import { ModalEditProject } from "./components/ModalEditProjects";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";

export function ListProjects() {
  const [currentProject, setCurrentProject] = useState("");
  const [isEditingProject, setIsEditingProject] = useState(false);
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useQuery(["projects"], () =>
    getProjects()
  );

  // Delete project mutation
  const { mutate } = useMutation((id: string) => deleteProject(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  return (
    <div>
      <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
        Listagem de Projetos
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
          {projects?.data.length ? (
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
                            Cliente Relacionado
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Valor Projeto
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
                          <Permission
                            roles={["EDITAR_PROJETO" || "DELETAR_PROJETO"]}
                          >
                            <StyledTableCell align="center">
                              Controles
                            </StyledTableCell>
                          </Permission>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projects?.data.map(
                          ({
                            _id,
                            title,
                            idClient,
                            valueProject,
                            gpProject,
                            description,
                          }: ProjectsInfo) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {title}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {idClient?.name}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {valueProject
                                  ? formatCurrency(valueProject)
                                  : "Sem Valor"}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ display: "none" }}
                                align="center"
                              >
                                {gpProject
                                  ? `${gpProject?.name} ${gpProject?.surname}`
                                  : "nenhum"}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {description}
                              </StyledTableCell>
                              <Permission
                                roles={["EDITAR_PROJETO" || "DELETAR_PROJETO"]}
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
                                  <Permission roles={["EDITAR_PROJETO"]}>
                                    <Edit
                                      onClick={() => {
                                        setCurrentProject(_id);
                                        setIsEditingProject(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
                                  <Permission roles={["DELETAR_PROJETO"]}>
                                    <Delete onClick={() => mutate(_id)} />
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
              <Permission roles={["EDITAR_PROJETO"]}>
                <ModalEditProject
                  isOpen={isEditingProject}
                  setIsOpen={setIsEditingProject}
                  currentProject={currentProject}
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
