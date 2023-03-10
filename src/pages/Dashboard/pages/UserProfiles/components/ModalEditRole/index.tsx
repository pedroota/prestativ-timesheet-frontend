import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoleById, updateRoles } from "services/roles.service";
import { useForm } from "react-hook-form";
import { Permission as Permissions } from "enums/Permissions";
import { Permission } from "components/Permission";
import { Roles } from "interfaces/roles.interface";
import InputLabel from "@mui/material/InputLabel";
import { SwitchIOS } from "components/SwitchIOS";
import ListItemText from "@mui/material/ListItemText";
import { toast } from "react-toastify";

interface ModalEditRoleProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentRole: string;
}

export function ModalEditRole({
  isOpen,
  setIsOpen,
  currentRole,
}: ModalEditRoleProps) {
  const queryClient = useQueryClient();
  const [multipleSelectValue, setMultipleSelectValue] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm();
  useQuery(["roles", currentRole], () => getRoleById(currentRole), {
    onSuccess({ data }) {
      reset(data);
      setMultipleSelectValue(data?.permissions);
    },
    enabled: !!currentRole,
  });

  const { mutate, isLoading } = useMutation(
    ({ name, permissions }: Pick<Roles, "name" | "permissions">) =>
      updateRoles(currentRole, { name, permissions }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["roles"]);
        setIsOpen((prevState) => !prevState);
        toast.success("Perfil foi atualizado com sucesso!");
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao editar este perfil", {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit((data) => {
    mutate({ name: data?.name, permissions: multipleSelectValue });
    reset();
  });

  const handleMultipleSelectChange = (
    event: SelectChangeEvent<typeof multipleSelectValue>
  ) => {
    const {
      target: { value },
    } = event;
    setMultipleSelectValue(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const options = {
    timesheetsData: [
      { value: Permissions.DATA, label: "Visualiza o campo Data" },
      {
        value: Permissions.DIA_DA_SEMANA,
        label: "Visualiza o campo Dia da Semana",
      },
      {
        value: Permissions.HORA_INICIAL,
        label: "Visualiza o campo Hora Inicial",
      },
      { value: Permissions.HORA_FINAL, label: "Visualiza o campo Hora Final" },
      { value: Permissions.TOTAL, label: "Visualiza o campo Total" },
      { value: Permissions.AJUSTE, label: "Visualiza o campo Ajuste" },
      {
        value: Permissions.TOTAL_COM_AJUSTE,
        label: "Visualiza o campo Total com Ajuste",
      },
      { value: Permissions.CLIENTE, label: "Visualiza o campo Cliente" },
      { value: Permissions.PROJETO, label: "Visualiza o campo Projeto" },
      { value: Permissions.ATIVIDADE, label: "Visualiza o campo Atividade" },
      { value: Permissions.VALOR, label: "Visualiza o campo Valor" },
      {
        value: Permissions.GERENTE_DE_PROJETOS,
        label: "Visualiza o campo Gerente de Projetos",
      },
      { value: Permissions.CONSULTOR, label: "Visualiza o campo Consultor" },
      {
        value: Permissions.ESCOPO_FECHADO,
        label: "Visualiza o campo Escopo Fechado",
      },
      {
        value: Permissions.APROVADO_GP,
        label: "Visualiza o campo Aprovado GP",
      },
      { value: Permissions.FATURAVEL, label: "Visualiza o campo Faturável" },
      { value: Permissions.LANCADO, label: "Visualiza o campo Lançado" },
      { value: Permissions.APROVADO, label: "Visualiza o campo Aprovado" },
      {
        value: Permissions.CHAMADO_LANCADO,
        label: "Visualiza o campo Chamado Lançado",
      },
      {
        value: Permissions.DESCRICAO_DA_ATIVIDADE,
        label: "Visualiza o campo Descrição da Atividade",
      },
      {
        value: Permissions.DATA_SISTEMA_DATA_EDICAO,
        label: "Visualiza o campo Data Sistema / Edição",
      },
    ],
    lancamentoHoras: [
      {
        value: Permissions.TIMESHEET,
        label: "Opção do Menu para acessar o Timesheet",
      },
      {
        value: Permissions.LANCAR_HORAS,
        label: "Autorizado para Lançar Horas",
      },
      {
        value: Permissions.DELETAR_HORAS,
        label: "Autorizado para Deletar Horas",
      },
      {
        value: Permissions.EDITAR_HORAS,
        label: "Autorizado para Editar Horas*",
      },
      {
        value: Permissions.EDITAR_AJUSTE,
        label: "Editar Ajuste de um lançamento de horas",
      },
      {
        value: Permissions.EDITAR_CHAMADO_LANCADO,
        label: "Editar campo Chamado Lançado de um lançamento de horas",
      },
      {
        value: Permissions.EDITAR_CAMPOS_HORAS_LANCADAS,
        label: "Pode editar demais campos de um lançamento de horas",
      },
      {
        value: Permissions.EXPORTAR_EXCEL,
        label: "Autorização para exportar os dados da sua tela para Excel",
      },
    ],
    clientes: [
      {
        value: Permissions.VER_CLIENTES,
        label: "Opção do Menu para acessar os Clientes",
      },
      {
        value: Permissions.CADASTRO_CLIENTE,
        label: "Autorizado para Cadastrar um Novo Cliente",
      },
      {
        value: Permissions.EDITAR_CLIENTE,
        label: "Autorizado para Editar Clientes Existentes",
      },
      {
        value: Permissions.DELETAR_CLIENTE,
        label: "Autorizado para Deletar Clientes",
      },
    ],
    projetos: [
      {
        value: Permissions.VER_PROJETOS,
        label: "Opção do Menu para acessar os Projetos",
      },
      {
        value: Permissions.CADASTRO_PROJETO,
        label: "Autorizado para Cadastrar um Novo Projeto",
      },
      {
        value: Permissions.EDITAR_PROJETO,
        label: "Autorizado para Editar Projetos Existentes",
      },
      {
        value: Permissions.DELETAR_PROJETO,
        label: "Autorizado para Deletar Projetos",
      },
    ],
    atividades: [
      {
        value: Permissions.VER_ATIVIDADES,
        label: "Opção do Menu para acessar as Atividades",
      },
      {
        value: Permissions.CADASTRO_ATIVIDADE,
        label: "Autorizado para Cadastrar uma Nova Atividade",
      },
      {
        value: Permissions.EDITAR_ATIVIDADE,
        label: "Autorizado para Editar Atividades Existentes",
      },
      {
        value: Permissions.DELETAR_ATIVIDADE,
        label: "Autorizado para Deletar Atividades",
      },
    ],
    usuarios: [
      {
        value: Permissions.VER_USUARIOS,
        label: "Opção do Menu para acessar os Usuários",
      },
      {
        value: Permissions.CADASTRO_USUARIO,
        label: "Autorizado para Cadastrar um Novo Usuário",
      },
      {
        value: Permissions.EDITAR_USUARIO,
        label: "Autorizado para Editar Usuários Existentes",
      },
      {
        value: Permissions.DELETAR_USUARIO,
        label: "Autorizado para Deletar Usuários",
      },
    ],
    perfisUsuario: [
      {
        value: Permissions.PERFIS_USUARIO,
        label: "Opção do Menu para acessar os Perfis de Usuário",
      },
      {
        value: Permissions.CRIAR_PERFIL,
        label: "Autorizado para Cadastrar um Novo Perfil de Usuário",
      },
      {
        value: Permissions.EDITAR_PERFIL,
        label: "Autorizado para Editar Perfis de Usuário Existentes",
      },
      {
        value: Permissions.DELETAR_PERFIL,
        label: "Autorizado para Deletar Perfis de Usuário",
      },
    ],
    outros: [
      {
        value: Permissions.VER_LOGS,
        label: "Opção do Menu para acessar os Logs",
      },
      {
        value: Permissions.CONFIGURACOES,
        label: "Opção do Menu para acessar as Configurações",
      },
      {
        value: Permissions.DASHBOARD,
        label: "Opção do Menu para acessar a Dashboard",
      },
    ],
  };

  return (
    <Permission roles={["EDITAR_PERFIL"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4, minWidth: "26.25rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar perfil</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <TextField
              color="warning"
              {...register("name")}
              label="Nome do perfil"
              InputLabelProps={{ shrink: true }}
            />

            <InputLabel id="demo-multiple-checkbox-label">
              Permissões para Ver Campos do Timesheet
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.timesheetsData.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="demo-multiple-checkbox-label">
              Permissões Lançamentos de Horas
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.lancamentoHoras.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="demo-multiple-checkbox-label">
              Permissões Clientes
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.clientes.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="demo-multiple-checkbox-label">
              Permissões Projetos
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.projetos.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="demo-multiple-checkbox-label">
              Permissões Atividades
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.atividades.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="demo-multiple-checkbox-label">
              Permissões Usuários
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.usuarios.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="demo-multiple-checkbox-label">
              Permissões Perfís de Usuário
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.perfisUsuario.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
            <InputLabel id="demo-multiple-checkbox-label">
              Outras Permissões
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.outros.map((permission) => (
                <MenuItem
                  key={permission.value}
                  value={permission.value}
                  sx={{ justifyContent: "spaceBetween" }}
                >
                  <SwitchIOS
                    color="warning"
                    checked={multipleSelectValue.indexOf(permission.value) > -1}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ marginRight: 2 }}
                  />
                  <ListItemText primary={permission.value} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              type="submit"
              color="warning"
              sx={{ paddingBlock: "1rem" }}
            >
              {isLoading && <CircularProgress size={16} />}
              {!isLoading && "Concluído"}
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}
