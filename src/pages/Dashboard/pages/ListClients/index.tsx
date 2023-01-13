import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteClient, getClients } from "services/clients.service";
import {
  Table,
  TableBody,
  styled,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ClientsInfo } from "interfaces/clients.interface";
import { EmptyList } from "components/EmptyList";
import { ModalEditClient } from "./components/ModalEditClient";

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
  const [currentClient, setCurrentClient] = useState("");
  const [isEditingClient, setIsEditingClient] = useState(false);
  const { data: clients } = useQuery(["clients"], () => getClients());
  const queryClient = useQueryClient();

  // Delete client Mutation
  const { mutate } = useMutation((id: string) => deleteClient(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
    },
  });

  return (
    <div>
      <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
        Listagem de Clientes
      </Typography>
      {clients?.data.length ? (
        <div>
          <Paper>
            <div className="c-table">
              <div className="c-table--helper">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow className="c-table--reset-head">
                      <StyledTableCell align="center">Nome</StyledTableCell>
                      <StyledTableCell align="center">CNPJ</StyledTableCell>
                      <StyledTableCell align="center">Endereço</StyledTableCell>
                      <StyledTableCell align="center">
                        Período Faturado
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Limite de Cobrança + Dia de Pagamento
                      </StyledTableCell>
                      <StyledTableCell align="center">Valor</StyledTableCell>
                      <StyledTableCell align="center">
                        Gerente de Projetos
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Controles
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients?.data.map(
                      ({
                        _id,
                        name,
                        cnpj,
                        cep,
                        street,
                        streetNumber,
                        complement,
                        district,
                        city,
                        state,
                        periodIn,
                        periodUntil,
                        billingLimit,
                        payDay,
                        valueClient,
                        gpClient,
                      }: ClientsInfo) => (
                        <StyledTableRow key={_id}>
                          <StyledTableCell align="center">
                            {name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {cnpj}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {`${cep} ${street} ${streetNumber} ${complement} Bairro ${district} ${city} ${state}`}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {`De: ${periodIn} Até: ${periodUntil}`}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {`${billingLimit} / ${payDay}`}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {valueClient}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {gpClient}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              display: "grid",
                              gap: "20px",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                            align="center"
                          >
                            <EditIcon
                              onClick={() => {
                                setCurrentClient(_id);
                                setIsEditingClient((prevState) => !prevState);
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
          <ModalEditClient
            isOpen={isEditingClient}
            setIsOpen={setIsEditingClient}
            currentClient={currentClient}
          />
        </div>
      ) : (
        <EmptyList />
      )}
    </div>
  );
}
