import { Table, TableHead, TableRow, TableBody } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Permission } from "components/Permission";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Hours } from "interfaces/hours.interface";
import { getHoursLatest } from "services/hours.service";
import { generateTotalHours } from "utils/timeControl";

export function DashboardView() {
  const { data: hoursThisMonth } = useQuery(["hours"], () => getHoursLatest());

  // adiciona o valor total de horas para cada objeto do array
  const updatedHoursThisMonth = hoursThisMonth?.data?.map(
    (entry: { initial: number; final: number }) => {
      const totalHours = generateTotalHours(entry.initial, entry.final);
      return {
        ...entry,
        totalHours,
      };
    }
  );

  // cria um novo array com objetos formatados = clientes -> projetos dele -> atividades dele -> soma de todos os lançamentos de horas
  const grouped = updatedHoursThisMonth.reduce(
    (
      acc: {
        [x: string]: {
          clientName: string;
          projects: {
            [x: string]: {
              projectName: string;
              activities: {
                [x: string]: { totalHours: number };
              };
            };
          };
        };
      },
      curr: Hours & { totalHours: string }
    ) => {
      const { relClient, relProject, relActivity, totalHours } = curr;
      const clientId = relClient._id;
      const projectId = relProject._id;
      const activityTitle = relActivity.title;

      if (!acc[clientId]) {
        acc[clientId] = {
          clientName: relClient.name,
          projects: {},
        };
      }

      if (!acc[clientId].projects[projectId]) {
        acc[clientId].projects[projectId] = {
          projectName: relProject.title,
          activities: {},
        };
      }

      if (!acc[clientId].projects[projectId].activities[activityTitle]) {
        acc[clientId].projects[projectId].activities[activityTitle] = {
          totalHours: 0,
        };
      }

      acc[clientId].projects[projectId].activities[activityTitle].totalHours +=
        parseFloat(totalHours);

      return acc;
    },
    {}
  );

  console.log(grouped);

  return (
    <Permission roles={["DASHBOARD"]}>
      <h1>Dashboard</h1>
      <Table className="c-table" aria-label="customized table">
        <TableHead>
          <TableRow className="c-table--reset-head">
            <StyledTableCell align="center">Cliente</StyledTableCell>
            <StyledTableCell align="center">Projeto</StyledTableCell>
            <StyledTableCell align="center">Atividade</StyledTableCell>
            <StyledTableCell align="center">Total de Horas</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(grouped).map((clientId) => (
            <>
              <StyledTableRow key={clientId}>
                <StyledTableCell component="th" scope="row" align="center">
                  {grouped[clientId].clientName}
                </StyledTableCell>
                <StyledTableCell />
                <StyledTableCell />
                <StyledTableCell />
              </StyledTableRow>
              {Object.keys(grouped[clientId].projects).map((projectId) => (
                <>
                  <StyledTableRow key={projectId}>
                    <StyledTableCell />
                    <StyledTableCell component="th" scope="row" align="center">
                      {grouped[clientId].projects[projectId].projectName}
                    </StyledTableCell>
                    <StyledTableCell />
                    <StyledTableCell />
                  </StyledTableRow>
                  {Object.keys(
                    grouped[clientId].projects[projectId].activities
                  ).map((activityTitle) => (
                    <StyledTableRow key={activityTitle}>
                      <StyledTableCell />
                      <StyledTableCell />
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {activityTitle}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {
                          grouped[clientId].projects[projectId].activities[
                            activityTitle
                          ].totalHours
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </Permission>
  );
}
