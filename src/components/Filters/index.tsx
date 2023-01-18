import { MenuItem, TextField } from "@mui/material";
import Button from "@mui/material/Button";

export function Filters() {
  return (
    <div style={{ display: "flex", marginBottom: "20px", gap: "8px" }}>
      <h2>Filtros: </h2>
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
      <TextField
        id="date"
        label="Data"
        type="date"
        defaultValue="2017-05-24"
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        style={{ width: "200px" }}
        select
        label="Cliente"
        name="client"
      >
        <MenuItem selected value={1}>
          Cliente 1
        </MenuItem>
        <MenuItem selected value={2}>
          Cliente 2
        </MenuItem>
      </TextField>
      <TextField
        style={{ width: "200px" }}
        select
        label="Projeto"
        name="project"
      >
        <MenuItem selected value={1}>
          Projeto 1
        </MenuItem>
        <MenuItem selected value={2}>
          Projeto 2
        </MenuItem>
      </TextField>
      <TextField
        style={{ width: "200px" }}
        select
        label="Atividade"
        name="activity"
      >
        <MenuItem selected value={1}>
          Atividade 1
        </MenuItem>
        <MenuItem selected value={2}>
          Atividade 2
        </MenuItem>
      </TextField>
      <TextField
        style={{ width: "200px" }}
        select
        label="Consultor"
        name="consultant"
      >
        <MenuItem selected value={1}>
          Consultor 1
        </MenuItem>
        <MenuItem selected value={2}>
          Consultor 2
        </MenuItem>
      </TextField>
      <Button variant="contained">FILTRAR</Button>
      <Button variant="contained">LIMPAR FILTROS</Button>
    </div>
  );
}
