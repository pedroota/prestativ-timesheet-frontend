import Input from "@mui/material/Input";
import { MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";

export function Filters() {
  return (
    <div style={{ display: "flex", marginBottom: "20px" }}>
      <h2>Filtros: </h2>
      <div style={{ paddingLeft: "20px" }}>
        {/* como as datas estão salvas em TIMESTAMP - para filtrar pode inserir a data, o sistema trata esses dados:
            se inserir o dia 25/01/2023 nos filtros por exemplo:
            o sistema pega o timestamp desse dia às 00:00:00 até 23:59:59 do mesmo dia - no caso:
            1674604800 até 1674691199
            e então filtra todos os lançamentos (iniciais e finais) que estão entre isso, por exemplo 16h do dia 25:
            1674604800 < 1674662400 < 1674691199 
            em código seria algo como:
            if ( dataFiltroInicial < lancamento && lancamento < dataFiltroFinal ) { exibir esse registro na tela do timesheet }
            https://rogertakemiya.com.br/converter-data-para-timestamp/
            */}
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
