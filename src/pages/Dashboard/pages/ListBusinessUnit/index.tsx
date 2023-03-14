import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusiness } from "services/business.service";
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
import { BusinessUnit } from "interfaces/business.interface";
import { EmptyList } from "components/EmptyList";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";
import { ModalDeleteBusiness } from "./components/ModalDeleteBusiness";
import { ModalEditBusiness } from "./components/ModalEditBusiness";
import { ModalRegisterBusiness } from "./components/ModalRegisterBusiness";

export function ListBusinessUnit() {
  const [currentBusiness, setCurrentBusiness] = useState("");
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isDeletingBusiness, setIsDeletingBusiness] = useState(false);
  const [isAddingBusiness, setIsAddingBusiness] = useState(false);
  const { data: business, isLoading } = useQuery(
    [
      "business",
      currentBusiness,
      isEditingBusiness,
      isDeletingBusiness,
      isAddingBusiness,
    ],
    () => getBusiness()
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
          Business Unity
        </Typography>
        <Permission roles={["CADASTRO_BU"]}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setIsAddingBusiness((prevState) => !prevState)}
          >
            Cadastrar Business Unit
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
          {business?.data.length ? (
            <div>
              <Paper className="c-timesheet">
                <div className="c-table">
                  <div className="c-table--helper">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow className="c-table--reset-head">
                          <StyledTableCell align="center">
                            Nome Business Unit
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Usuário
                          </StyledTableCell>
                          <Permission roles={["EDITAR_BU" || "DELETAR_BU"]}>
                            <StyledTableCell align="center">
                              Controles
                            </StyledTableCell>
                          </Permission>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {business?.data.map(
                          ({ _id, nameBU, relUser }: BusinessUnit) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {nameBU}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {`${relUser.name} ${relUser.surname}`}
                              </StyledTableCell>
                              <Permission roles={["EDITAR_BU" || "DELETAR_BU"]}>
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
                                  <Permission roles={["EDITAR_BU"]}>
                                    <Edit
                                      onClick={() => {
                                        setCurrentBusiness(_id as string);
                                        setIsEditingBusiness(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
                                  <Permission roles={["DELETAR_BU"]}>
                                    <Delete
                                      onClick={() => {
                                        setCurrentBusiness(_id as string);
                                        setIsDeletingBusiness(
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

      <Permission roles={["EDITAR_BU"]}>
        <ModalEditBusiness
          isOpen={isEditingBusiness}
          setIsOpen={setIsEditingBusiness}
          currentBusiness={currentBusiness}
        />
      </Permission>

      <Permission roles={["CADASTRO_BU"]}>
        <ModalRegisterBusiness
          isOpen={isAddingBusiness}
          setIsOpen={setIsAddingBusiness}
        />
      </Permission>
      <Permission roles={["DELETAR_BU"]}>
        <ModalDeleteBusiness
          isOpen={isDeletingBusiness}
          setIsOpen={setIsDeletingBusiness}
          currentBusiness={currentBusiness}
        />
      </Permission>
    </div>
  );
}
