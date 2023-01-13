import { useQuery } from "@tanstack/react-query";
import { deleteProject, getProjects } from "services/project.service";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ProjectsInfo } from "interfaces/projects.interface";
import { EmptyList } from "components/EmptyList";

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
  const { data: projects } = useQuery(["projects"], () => getProjects());

  return (
    <div>
      <h1>Listagem de Projetos</h1>
      {projects?.data.length ? (
        <div>
          <Paper className="c-timesheet">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
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
                  <StyledTableCell align="center">Descrição</StyledTableCell>
                  <StyledTableCell align="center">Controles</StyledTableCell>
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
                      <StyledTableCell align="center">{title}</StyledTableCell>
                      <StyledTableCell align="center">
                        {idClient}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {valueProject}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {gpProject}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <EditIcon />
                        <DeleteIcon
                          onClick={() => {
                            deleteProject(_id);
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Paper>
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
}
