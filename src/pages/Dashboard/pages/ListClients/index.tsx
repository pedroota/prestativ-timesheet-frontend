import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "services/clients.service";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ClientsInfo } from "interfaces/clients.interface";
import { EmptyList } from "components/EmptyList";
import { ModalEditClient } from "./components/ModalEditClient";
import { formatCurrency } from "utils/formatCurrency";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";
import { ModalRegisterClient } from "./components/ModalRegisterClient";
import { ModalDeleteClient } from "./components/ModalDeleteClient";
import Chip from "@mui/material/Chip";

export function ListClients() {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [currentClient, setCurrentClient] = useState("");
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const { data: clients, isLoading } = useQuery(
    [
      "clients",
      currentClient,
      isAddingClient,
      isEditingClient,
      isDeletingClient,
    ],
    () => getClients()
  );

  return (
    <div className="class-cliente">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          left: "100%",
          width: "85vw",
        }}
      >
        <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
          Clientes
        </Typography>

        <Permission roles={["CADASTRO_CLIENTE"]}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setIsAddingClient((prevState) => !prevState)}
          >
            Cadastrar cliente
          </Button>
        </Permission>
      </Box>
      {isLoading ? (
        <Box
          sx={{
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
          {clients?.data.length ? (
            <div className="table-cliente">
              <Paper>
                <div>
                  <div>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow className="c-table--reset-head">
                          <StyledTableCell align="center">
                            Razão Social
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Nome Fantasia
                          </StyledTableCell>
                          <StyledTableCell align="center">CNPJ</StyledTableCell>
                          <StyledTableCell align="center">
                            Endereço
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Período Faturado
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Limite de Cobrança
                            <br /> + Dia de Pagamento
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Valor
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Gerente de Projetos
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Business Unit
                          </StyledTableCell>
                          <Permission
                            roles={["EDITAR_CLIENTE" || "DELETAR_CLIENTE"]}
                          >
                            <StyledTableCell align="center">
                              Controles
                            </StyledTableCell>
                          </Permission>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clients?.data.map(
                          ({
                            _id,
                            corporateName,
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
                            businessUnit,
                          }: ClientsInfo) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {corporateName}
                              </StyledTableCell>
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
                                {formatCurrency(valueClient)}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {gpClient.length ? (
                                  gpClient.map(({ name, surname }) => (
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
                                {businessUnit ? (
                                  <p>{`${businessUnit.nameBU}`}</p>
                                ) : (
                                  <p>Nenhum B.U.</p>
                                )}
                              </StyledTableCell>
                              <Permission
                                roles={["EDITAR_CLIENTE" || "DELETAR_CLIENTE"]}
                              >
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
                                  <Permission roles={["EDITAR_CLIENTE"]}>
                                    <EditIcon
                                      onClick={() => {
                                        setCurrentClient(_id);
                                        setIsEditingClient(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
                                  <Permission roles={["DELETAR_CLIENTE"]}>
                                    <DeleteIcon
                                      onClick={() => {
                                        setCurrentClient(_id);
                                        setIsDeletingClient(
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
          <Permission roles={["EDITAR_CLIENTE"]}>
            <ModalEditClient
              isOpen={isEditingClient}
              setIsOpen={setIsEditingClient}
              currentClient={currentClient}
            />
          </Permission>
          <Permission roles={["CADASTRO_CLIENTE"]}>
            <ModalRegisterClient
              isOpen={isAddingClient}
              setIsOpen={setIsAddingClient}
            />
          </Permission>
          <Permission roles={["DELETAR_CLIENTE"]}>
            <ModalDeleteClient
              isOpen={isDeletingClient}
              setIsOpen={setIsDeletingClient}
              currentClient={currentClient}
            />
          </Permission>
        </>
      )}
    </div>
  );
}
