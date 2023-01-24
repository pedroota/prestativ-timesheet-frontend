import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProject, getProjects } from "services/project.service";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ProjectsInfo } from "interfaces/projects.interface";
import { EmptyList } from "components/EmptyList";
import { formatCurrency } from "utils/formatCurrency";
import { ModalEditProject } from "./components/ModalEditProjects";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function ListProjects() {
  const [currentProject, setCurrentProject] = useState("");
  const [isEditingProject, setIsEditingProject] = useState(false);
  const queryClient = useQueryClient();
  const { data: projects } = useQuery(["projects"], () => getProjects());

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
      {projects?.data.length ? (
        <div>
          <Paper className="c-timesheet">
            <div className="c-table">
              <div className="c-table--helper">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow className="c-table--reset-head">
                      <StyledTableCell align="center">Titulo</StyledTableCell>
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
                      <StyledTableCell align="center">
                        Controles
                      </StyledTableCell>
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
                            {formatCurrency(valueProject)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {`${gpProject?.name} ${gpProject?.surname}`}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {description}
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
                                setCurrentProject(_id);
                                setIsEditingProject((prevState) => !prevState);
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
          <ModalEditProject
            isOpen={isEditingProject}
            setIsOpen={setIsEditingProject}
            currentProject={currentProject}
          />
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
}
