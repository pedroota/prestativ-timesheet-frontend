import { useQuery } from "@tanstack/react-query";
import { deleteClient, getClients } from "services/clients.service";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ClientsInfo } from "interfaces/clients.interface";

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

export function ListClients() {
  const { data: clients } = useQuery(["clients"], () => getClients());

  return (
    <div>
      <h1>Listagem de Clientes</h1>
      <Paper className="c-timesheet">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Nome</StyledTableCell>
              <StyledTableCell align="center">CNPJ</StyledTableCell>
              <StyledTableCell align="center">Endereço</StyledTableCell>
              <StyledTableCell align="center">Período Faturado</StyledTableCell>
              <StyledTableCell align="center">
                Limite de Cobrança + <br /> Dia de Pagamento
              </StyledTableCell>
              <StyledTableCell align="center">Valor</StyledTableCell>
              <StyledTableCell align="center">
                Gerente de Projetos
              </StyledTableCell>
              <StyledTableCell align="center">Controles</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients?.data.map(
              ({
                _id,
                code,
                name,
                cnpj,
                cep,
                street,
                streetNumber,
                complement,
                district,
                city,
                state,
                createdAt,
                updatedAt,
                periodIn,
                periodUntil,
                billingLimit,
                payDay,
                valueClient,
                gpClient,
              }: ClientsInfo) => (
                <StyledTableRow key={_id}>
                  <StyledTableCell align="center">{name}</StyledTableCell>
                  <StyledTableCell align="center">{cnpj}</StyledTableCell>
                  <StyledTableCell align="center">
                    {cep + " " + street + " " + streetNumber + " " + complement}
                    <br />
                    {"Bairro " + district + " " + city + " " + state}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {"de: " + periodIn + "  até: " + periodUntil}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {billingLimit + " / " + payDay}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {valueClient}
                  </StyledTableCell>
                  <StyledTableCell align="center">{gpClient}</StyledTableCell>
                  <StyledTableCell align="center">
                    <EditIcon />
                    <DeleteIcon
                      onClick={() => {
                        deleteClient(_id);
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
  );
}
