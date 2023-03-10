function generateDateWithTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleDateString();
}

function generateTimeWithTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return `${hours}:${minutes}`;
}

function generateTimeAndDateWithTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month =
    date.getMonth() <= 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() <= 10 ? "0" + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return [`${year}-${month}-${day}`, `${hours}:${minutes}`];
}

function generateDayWeekWithTimestamp(timestamp: number) {
  const option: object = { weekday: "short" };
  const locale = "pt-br";
  return new Date(timestamp)
    .toLocaleDateString(locale, option)
    .toUpperCase()
    .slice(0, -1);
}

function generateTimestampWithDateAndTime(date: string, time: string) {
  const dateFormated = date.split("-");
  const timeFormated = time.split(":");

  return new Date(
    Number(dateFormated[0]),
    Number(dateFormated[1]) - 1,
    // no JS os meses são contados a partir do ZERO - portanto o mês 11 é DEZEMBRO
    // os meses aqui chegam com o número equivalente, e então é subtraido 1 para ficar no formato que o JS aceita
    Number(dateFormated[2]),
    Number(timeFormated[0]),
    Number(timeFormated[1])
  ).getTime();
}

function generateTotalHours(initial: number, final: number) {
  let signal = "";
  if (final < initial) {
    signal = "-";
    const temp = initial;
    initial = final;
    final = temp;
  }
  let hours = Math.trunc((final - initial) / 60 / 60 / 1000);
  let minutes = Math.trunc(((final - initial) / 60 / 1000) % 60);
  if (hours > 60) {
    minutes = hours % 60;
    hours = Math.trunc(hours / 60);
  }
  return `${signal}${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function generateAdjustmentWithNumberInMilliseconds(number: number) {
  let signal = "";
  if (number < 0) {
    signal = "-";
    number = Math.abs(number);
  }

  let seconds = Math.floor(number / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  minutes %= 60;
  seconds %= 60;

  const hoursFormated = hours < 10 ? "0" + hours : hours;
  const minutesFormated = minutes < 10 ? "0" + minutes : minutes;

  return `${signal}${hoursFormated}:${minutesFormated}`;
}

function generateMilisecondsWithHoursAndMinutes(timeString: string) {
  const sign = timeString.startsWith("-") ? -1 : 1;
  const timeFormated = timeString.replace("-", "").split(":");
  const hours = Number(timeFormated[0]) * sign;
  const minutes = Number(timeFormated[1]) * sign;
  return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
}

function generateTotalWithAdjustment(total: string, adjustment: string) {
  const totalMilliseconds = generateMilisecondsWithHoursAndMinutes(total);
  const adjustmentMilliseconds =
    generateMilisecondsWithHoursAndMinutes(adjustment);
  const sign = adjustmentMilliseconds < 0 ? "-" : "+";
  let operation = 0;
  if (sign == "+") {
    operation = totalMilliseconds + adjustmentMilliseconds;
  } else {
    operation = totalMilliseconds + adjustmentMilliseconds;
  }
  const totalSign = operation < 0 ? "-" : "";
  const totalWithAdjustment = Math.abs(operation);
  const hours = Math.floor(totalWithAdjustment / (60 * 60 * 1000));
  const minutes = Math.floor(
    (totalWithAdjustment % (60 * 60 * 1000)) / (60 * 1000)
  );
  return `${totalSign}${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}

function generateTotalHoursWithAdjustment(
  initial: number,
  final: number,
  adjustment: number
) {
  const total = generateTotalHours(initial, final);
  if (!adjustment) {
    return total;
  } else {
    const adjustmentFormated =
      generateAdjustmentWithNumberInMilliseconds(adjustment);
    return generateTotalWithAdjustment(total, adjustmentFormated);
  }
}

function convertDate(dateString: string) {
  const parts = dateString.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  generateTimeAndDateWithTimestamp,
  generateDayWeekWithTimestamp,
  generateTimestampWithDateAndTime,
  generateTotalHours,
  generateAdjustmentWithNumberInMilliseconds,
  generateMilisecondsWithHoursAndMinutes,
  generateTotalWithAdjustment,
  generateTotalHoursWithAdjustment,
  convertDate,
};
