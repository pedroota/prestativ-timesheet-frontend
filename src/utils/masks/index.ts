const cepMask = (value: string) => {
  return value
    .replace(/\D+/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

const cnpjMask = (value: string) => {
  return value
    .replace(/\D+/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const currencyMask = (value: string) => {
  const regex = /^[0-9\b]+$/;
  if (!regex.test(value)) {
    return false;
  }
  return value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    .replace(".", "R$ ");
};

export { cepMask, cnpjMask, currencyMask };
