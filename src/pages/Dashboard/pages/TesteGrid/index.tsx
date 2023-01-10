import { DataGrid, GridColumns, GridRowsProp } from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from "@mui/x-data-grid-generator";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "services/auth.service";

export default function TesteGrid() {
  const { data: users } = useQuery(["users"], () => getAllUsers());
  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}

const columns: GridColumns = [
  { field: "name", headerName: "Name", width: 180, editable: true },
  { field: "surname", headerName: "Sobrenome", width: 180, editable: true },
  { field: "email", headerName: "Email", editable: true },
  {
    field: "password",
    headerName: "Senha",
    type: "password",
    width: 180,
    editable: true,
  },
  { field: "role", headerName: "Permissão", width: 220, editable: true },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    surname: randomTraderName(),
    email: "pedro@prestativ.com.br",
    password: "",
    role: "Consultor",
  },
  {
    id: 2,
    name: randomTraderName(),
    surname: randomTraderName(),
    email: "joao@prestativ.com.br",
    password: "",
    role: "Consultor",
  },
  {
    id: 3,
    name: randomTraderName(),
    surname: randomTraderName(),
    email: "filipe@prestativ.com.br",
    password: "",
    role: "Consultor",
  },
];
