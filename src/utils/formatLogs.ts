export function formatLogs(action: string) {
  const actionSplited = action.split(" ");
  let returnMethod = "";
  let returnAction = "";

  switch (actionSplited[0]) {
    case "POST":
      returnMethod = "Criou";
      break;
    case "DELETE":
      returnMethod = "Apagou";
      break;
    case "PUT":
      returnMethod = "Atualizou";
      break;
    case "PATCH":
      returnMethod = "Atualizou";
      break;
    default:
      returnMethod = "Sem informações";
      break;
  }

  if (actionSplited[1].includes("/auth")) {
    returnAction = "usuário";
  }

  if (actionSplited[1].includes("/roles")) {
    returnAction = "perfil";
  }

  if (actionSplited[1].includes("/clients")) {
    returnAction = "cliente";
  }

  if (actionSplited[1].includes("/projects")) {
    returnAction = "projeto";
  }

  if (actionSplited[1].includes("/activities")) {
    returnAction = "atividades";
  }

  if (actionSplited[1].includes("/hours")) {
    returnAction = "horas";
  }

  return `${returnMethod} ${returnAction}`;
}
