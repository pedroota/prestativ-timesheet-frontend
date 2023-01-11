import Input from "@mui/material/Input";
import { MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";

export function Filters() {
  return (
    <div style={{ display: "flex", marginBottom: "20px" }}>
      <h2>Filtros: </h2>
      <div style={{ paddingLeft: "20px" }}>
        <h3>Data:</h3>
        <Input type="date" name="data" placeholder="Data" />
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <h3>Cliente:</h3>
        <Select style={{ width: "200px" }} name="client">
          <MenuItem selected value={-1}>
            Selecione
          </MenuItem>
        </Select>
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <h3>Projeto:</h3>
        <Select style={{ width: "200px" }} name="project">
          <MenuItem selected value={-1}>
            Selecione
          </MenuItem>
        </Select>
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <h3>Atividade:</h3>
        <Select style={{ width: "200px" }} name="activity">
          <MenuItem selected value={-1}>
            Selecione
          </MenuItem>
        </Select>
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <h3>Consultor:</h3>
        <Select style={{ width: "200px" }} name="consultant">
          <MenuItem selected value={-1}>
            Selecione
          </MenuItem>
        </Select>
      </div>
      <Button>FILTRAR</Button>
      <Button>
        LIMPAR
        <br />
        FILTROS
      </Button>
    </div>
  );
}
