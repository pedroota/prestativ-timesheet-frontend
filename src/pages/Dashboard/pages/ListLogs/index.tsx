import {
  Typography,
  Table,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  Box,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { EmptyList } from "components/EmptyList";
import { getLogs } from "services/logs.service";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Logs } from "interfaces/logs.interface";
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
} from "utils/timeControl";
import { formatLogs } from "utils/formatLogs";
import { Permission } from "components/Permission";

export function ListLogs() {
  const { data: logs, isLoading } = useQuery(["logs"], getLogs);

  return (
    <Permission roles={["VER_LOGS"]}>
      <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
        Listagem de Logs
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
          {logs?.data.length ? (
            <div>
              <Paper>
                <div className="c-table">
                  <div className="c-table--helper">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Nome</StyledTableCell>
                          <StyledTableCell align="center">
                            Cargo
                          </StyledTableCell>
                          <StyledTableCell align="center">Data</StyledTableCell>
                          <StyledTableCell align="center">Ação</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {logs?.data.map(
                          ({
                            name,
                            surname,
                            action,
                            role,
                            createdAt,
                            _id,
                          }: Logs) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {`${name} ${surname}`}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {role.name}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {`${generateDateWithTimestamp(
                                  createdAt
                                )} ${generateTimeWithTimestamp(createdAt)}`}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {formatLogs(action)}
                              </StyledTableCell>
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
    </Permission>
  );
}
