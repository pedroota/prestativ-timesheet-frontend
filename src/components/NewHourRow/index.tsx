import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { Checkbox, MenuItem, Select } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export function NewHourRow() {
  function submitHours() {
    console.log("enviando horas");
  }

  return (
    <TableRow>
      {/* Para apagar todos os comentários depois FAÇA ISSO: ctrl shift L com os 3 primeiros caracteres dessa linha selecionados e depois ctrl shift K */}
      {/* HORÁRIO INICIAL = inputDATE + inputTIME + dia da semana */}
      <StyledTableCell align="center">
        <Input type="date" />
        <Input type="time" />
        <p>QUA</p>
      </StyledTableCell>
      {/* HORÁRIO FINAL = inputDATE + inputTIME + dia da semana */}
      <StyledTableCell align="center">
        <Input type="date" />
        <Input type="time" />
        <p>QUA</p>
      </StyledTableCell>
      {/* TOTAL = Horário Final menos o Horário Inicial */}
      <StyledTableCell align="center">
        <p>F - I</p>
      </StyledTableCell>
      {/* AJUSTE = por padrão no lançamento vai ser ZERO, mas o ADM pode editar esse campo e inserir HH:MM de ajuste */}
      <StyledTableCell align="center">
        <p>00:00</p>
      </StyledTableCell>
      {/* TOTAL COM AJUSTE = total + ajuste --- não será exibido, por padrão esse campo pode conter apenas o valor TOTAL mesmo ;) */}
      <StyledTableCell align="center">
        <p>F - I</p>
      </StyledTableCell>
      {/* CLIENTE = listar todos os clientes */}
      <StyledTableCell align="center">
        <Select>
          <MenuItem key={1} value={1}>
            Cliente 1
          </MenuItem>
          <MenuItem key={2} value={2}>
            Cliente 2
          </MenuItem>
          <MenuItem key={3} value={3}>
            Cliente 3
          </MenuItem>
        </Select>
      </StyledTableCell>
      {/* PROJETO = listar todos os projetos de acordo com o cliente escolhido */}
      <StyledTableCell align="center">
        <Select>
          <MenuItem key={1} value={1}>
            Projeto 1
          </MenuItem>
          <MenuItem key={2} value={2}>
            Projeto 2
          </MenuItem>
          <MenuItem key={3} value={3}>
            Projeto 3
          </MenuItem>
        </Select>
      </StyledTableCell>
      {/* ATIVIDADE = listar todas as atividades de acordo com o projeto escolhido */}
      <StyledTableCell align="center">
        <Select>
          <MenuItem key={1} value={1}>
            Atividade 1
          </MenuItem>
          <MenuItem key={2} value={2}>
            Atividade 2
          </MenuItem>
          <MenuItem key={3} value={3}>
            Atividade 3
          </MenuItem>
        </Select>
      </StyledTableCell>
      {/* CONSULTOR = Vai vir preenchido sempre com o nome do próprio consultor que lançar, porém em usuários ADM deve mostrar o nome de quem lançou */}
      <StyledTableCell align="center">Filipe</StyledTableCell>{" "}
      {/* ESCOPO FECHADO = Por Padrão é não checado e desabilitado, apenas quem tem a permissão deve marcar isso ;) */}
      <StyledTableCell align="center">
        <Checkbox disabled />
        <br />
        <p>Não</p>
      </StyledTableCell>
      {/* FATURÁVEL = Por Padrão é não checado e desabilitado, apenas quem tem a permissão deve marcar isso ;) */}
      <StyledTableCell align="center">
        <Checkbox disabled />
        <br />
        <p>Não</p>
      </StyledTableCell>
      {/* LANÇADO = Por Padrão é não checado e desabilitado, apenas quem tem a permissão deve marcar isso ;) */}
      <StyledTableCell align="center">
        <Checkbox disabled />
        <br />
        <p>Não</p>
      </StyledTableCell>
      {/* APROVADO = Por Padrão é não checado e desabilitado, apenas quem tem a permissão deve marcar isso ;) */}
      <StyledTableCell align="center">
        <Checkbox disabled />
        <br />
        <p>Não</p>
      </StyledTableCell>
      {/* NÚMERO DO CHAMADO = Campo de texto livre, cada lançamento de horas terá um número diferente EXEMPLO: "GK49PL1A789" string de letras e numeros */}
      <StyledTableCell align="center">
        <Input type="text" />
      </StyledTableCell>
      {/* DATA SISTEMA = Data que foi lançado no sistema */}
      <StyledTableCell align="center">
        <p>aguardando lançamento...</p>
      </StyledTableCell>
      {/* DATA EDIÇÃO = Data que foi editado */}
      <StyledTableCell align="center">
        <p>aguardando lançamento...</p>
      </StyledTableCell>
      {/* CONTROLES = Durante a edição de linha exibir apenas o icone de salvar */}
      <StyledTableCell align="center">
        <Button onClick={() => submitHours()}>
          <SaveIcon />
        </Button>
      </StyledTableCell>
    </TableRow>
  );
}
