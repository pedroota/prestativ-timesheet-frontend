import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "services/project.service";
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
import { Delete, Edit } from "@mui/icons-material";
import { ProjectsInfo } from "interfaces/projects.interface";
import { EmptyList } from "components/EmptyList";
import { formatCurrency } from "utils/formatCurrency";
import { ModalEditProject } from "./components/ModalEditProjects";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";
import { ModalRegisterProject } from "./components/ModalRegisterProjects";
import { ModalDeleteProject } from "./components/ModalDeleteProject";
import Chip from "@mui/material/Chip";

export function ListProjects() {
  const [currentProject, setCurrentProject] = useState("");
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const { data: projects, isLoading } = useQuery(
    [
      "projects",
      currentProject,
      isEditingProject,
      isDeletingProject,
      isAddingProject,
    ],
    () => getProjects()
  );

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
          Projetos
        </Typography>
        <Permission roles={["CADASTRO_PROJETO"]}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setIsAddingProject((prevState) => !prevState)}
          >
            Cadastrar projeto
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
                          <StyledTableCell align="center">
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
                              <StyledTableCell align="center">
                                {gpProject.length ? (
                                  gpProject.map(({ name, surname }) => (
                                    <Chip
                                      key={name}
                                      label={`${name} ${surname}`}
                                      sx={{ margin: "0.25rem" }}
                                    />
                                  ))
                                ) : (
                                  <p>Nenhum usuário foi vinculado</p>
                                )}
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
                                    <Delete
                                      onClick={() => {
                                        setCurrentProject(_id);
                                        setIsDeletingProject(
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
            </div>
          ) : (
            <EmptyList />
          )}
        </>
      )}

      <Permission roles={["EDITAR_PROJETO"]}>
        <ModalEditProject
          isOpen={isEditingProject}
          setIsOpen={setIsEditingProject}
          currentProject={currentProject}
        />
      </Permission>

      <Permission roles={["CADASTRO_PROJETO"]}>
        <ModalRegisterProject
          isOpen={isAddingProject}
          setIsOpen={setIsAddingProject}
        />
      </Permission>
      <Permission roles={["DELETAR_PROJETO"]}>
        <ModalDeleteProject
          isOpen={isDeletingProject}
          setIsOpen={setIsDeletingProject}
          currentProject={currentProject}
        />
      </Permission>
    </div>
  );
}
