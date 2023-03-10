export enum Permission {
  // Timesheets Data
  DATA = "DATA",
  DIA_DA_SEMANA = "DIA_DA_SEMANA",
  HORA_INICIAL = "HORA_INICIAL",
  HORA_FINAL = "HORA_FINAL",
  TOTAL = "TOTAL",
  AJUSTE = "AJUSTE",
  TOTAL_COM_AJUSTE = "TOTAL_COM_AJUSTE",
  CLIENTE = "CLIENTE",
  PROJETO = "PROJETO",
  ATIVIDADE = "ATIVIDADE",
  VALOR = "VALOR",
  GERENTE_DE_PROJETOS = "GERENTE_DE_PROJETOS",
  CONSULTOR = "CONSULTOR",
  ESCOPO_FECHADO = "ESCOPO_FECHADO",
  APROVADO_GP = "APROVADO_GP",
  FATURAVEL = "FATURAVEL",
  LANCADO = "LANCADO",
  APROVADO = "APROVADO",
  CHAMADO_LANCADO = "CHAMADO_LANCADO",
  DESCRICAO_DA_ATIVIDADE = "DESCRICAO_DA_ATIVIDADE",
  DATA_SISTEMA_DATA_EDICAO = "DATA_SISTEMA_DATA_EDICAO",

  // Lançamento de Horas
  TIMESHEET = "TIMESHEET",
  LANCAR_HORAS = "LANCAR_HORAS",
  DELETAR_HORAS = "DELETAR_HORAS",
  EDITAR_HORAS = "EDITAR_HORAS",
  EDITAR_CAMPOS_HORAS_LANCADAS = "EDITAR_CAMPOS_HORAS_LANCADAS",
  EDITAR_AJUSTE = "EDITAR_AJUSTE",
  EDITAR_CHAMADO_LANCADO = "EDITAR_CHAMADO_LANCADO",
  EXPORTAR_EXCEL = "EXPORTAR_EXCEL",

  // Clientes
  VER_CLIENTES = "VER_CLIENTES",
  CADASTRO_CLIENTE = "CADASTRO_CLIENTE",
  EDITAR_CLIENTE = "EDITAR_CLIENTE",
  DELETAR_CLIENTE = "DELETAR_CLIENTE",

  // Projetos
  VER_PROJETOS = "VER_PROJETOS",
  CADASTRO_PROJETO = "CADASTRO_PROJETO",
  EDITAR_PROJETO = "EDITAR_PROJETO",
  DELETAR_PROJETO = "DELETAR_PROJETO",

  // Atividades
  VER_ATIVIDADES = "VER_ATIVIDADES",
  CADASTRO_ATIVIDADE = "CADASTRO_ATIVIDADE",
  EDITAR_ATIVIDADE = "EDITAR_ATIVIDADE",
  DELETAR_ATIVIDADE = "DELETAR_ATIVIDADE",

  // Usuários
  VER_USUARIOS = "VER_USUARIOS",
  CADASTRO_USUARIO = "CADASTRO_USUARIO",
  EDITAR_USUARIO = "EDITAR_USUARIO",
  DELETAR_USUARIO = "DELETAR_USUARIO",

  //Perfis de Usuário
  PERFIS_USUARIO = "PERFIS_USUARIO",
  CRIAR_PERFIL = "CRIAR_PERFIL",
  EDITAR_PERFIL = "EDITAR_PERFIL",
  DELETAR_PERFIL = "DELETAR_PERFIL",

  // Outros
  VER_LOGS = "VER_LOGS",
  CONFIGURACOES = "CONFIGURACOES",
  DASHBOARD = "DASHBOARD",
}
