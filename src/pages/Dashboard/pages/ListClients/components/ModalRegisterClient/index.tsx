import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import cep from "cep-promise";
import { Modal } from "components/ModalGeneral";
import { Permission } from "components/Permission";
import { Clients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserByRole } from "services/auth.service";
import { createClients } from "services/clients.service";
import { cepMask, cnpjMask, currencyMask } from "utils/masks";
import { validateCNPJ } from "utils/validator";

interface ModalRegisterClientProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalRegisterClient({
  isOpen,
  setIsOpen,
}: ModalRegisterClientProps) {
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [valueCep, setValueCep] = useState("");
  const [gpClient, setGpClient] = useState("");
  const { register, handleSubmit, reset, setValue } = useForm<Clients>({});
  const { data } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  useEffect(() => {
    if (valueCep && valueCep.length >= 8) {
      cep(valueCep).then(({ street, city, state, neighborhood }) => {
        setValue("street", street);
        setValue("city", city);
        setValue("state", state);
        setValue("district", neighborhood);
      });
    }
  }, [valueCep]);

  const [values, setValues] = useState({ cnpj: "" });

  const inputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const { mutate, isLoading } = useMutation(
    ({
      code,
      name,
      cnpj,
      cep,
      street,
      streetNumber,
      complement,
      district,
      city,
      state,
      periodIn,
      periodUntil,
      billingLimit,
      payDay,
      gpClient,
    }: Clients) =>
      createClients({
        code,
        name,
        cnpj,
        cep,
        street,
        streetNumber,
        complement,
        district,
        city,
        state,
        periodIn,
        periodUntil,
        billingLimit,
        payDay,
        valueClient: priceNumber,
        gpClient,
      }),
    {
      onSuccess: () => {
        reset();
        setValueCep("");
        setValues({ cnpj: "" });
        setPrice("");
        // setGpClient("");
        toast.success("Cadastro de cliente efetuado com sucesso!");
        setIsOpen((prevState) => !prevState);
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao criar o cliente", {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({
      code,
      name,
      cnpj,
      cep,
      street,
      streetNumber,
      complement,
      district,
      city,
      state,
      periodIn,
      periodUntil,
      billingLimit,
      payDay,
      gpClient,
    }) => {
      // Validates CNPJ
      if (!validateCNPJ(cnpj)) {
        return toast.error("O CNPJ digitado é inválido", { autoClose: 1500 });
      }
      mutate({
        code,
        name,
        cnpj,
        cep,
        street,
        streetNumber,
        complement,
        district,
        city,
        state,
        periodIn,
        periodUntil,
        billingLimit,
        payDay,
        valueClient: priceNumber,
        gpClient,
      });
    }
  );

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    const stringValueWithoutDots = stringValue.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Cadastrar novo cliente">
      <Permission roles={["CADASTRO_CLIENTE"]}>
        <form className="c-register-client" onSubmit={onSubmit}>
          <p>Informações gerais</p>
          <TextField
            required
            color="warning"
            label="Código do cliente"
            type="text"
            {...register("code")}
          />
          <TextField
            required
            color="warning"
            label="Nome / Razão Social"
            type="text"
            {...register("name")}
          />
          <TextField
            required
            color="warning"
            label="CNPJ"
            type="text"
            value={cnpjMask(values.cnpj)}
            {...register("cnpj")}
            onChange={inputChange}
          />
          <p>Endereço do cliente</p>
          <div className="c-register-client--input-container">
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="CEP"
              type="text"
              {...register("cep")}
              value={cepMask(valueCep)}
              onChange={(event) => setValueCep(event.target.value)}
            />
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="Logradouro"
              type="text"
              {...register("street")}
            />
          </div>
          <div className="c-register-client--input-container">
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="Cidade"
              type="text"
              {...register("city")}
            />
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="Estado"
              type="text"
              {...register("state")}
            />
          </div>
          <div className="c-register-client--input-container">
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="Bairro"
              type="text"
              {...register("district")}
            />
            <TextField
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="Número"
              type="text"
              {...register("streetNumber")}
            />
            <TextField
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="Complemento"
              type="text"
              {...register("complement")}
            />
          </div>
          <p>Período de faturamento</p>
          <div className="c-register-client--input-container">
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              label="De"
              type="text"
              {...register("periodIn")}
            />
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              label="Até"
              type="text"
              {...register("periodUntil")}
            />
          </div>
          <div className="c-register-client--input-container">
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              label="Dia limite de faturamento"
              type="text"
              {...register("billingLimit")}
            />
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              label="Dia de pagamento"
              type="text"
              {...register("payDay")}
            />
          </div>
          <p>Valor e Gerente de Projetos</p>
          <div className="c-register-client--input-container">
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              label="Valor"
              type="text"
              value={price && currencyMask(price)}
              {...register("valueClient")}
              onChange={(event) => setNewPrice(event)}
            />
            <TextField
              required
              label="Gerente de Projetos"
              select
              color="warning"
              {...register("gpClient")}
              sx={{ width: "100%" }}
              value={gpClient}
              onChange={(event) => setGpClient(event.target.value)}
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {data?.data.map(({ name, surname, _id }: UserRegister) => (
                <MenuItem value={_id} key={_id}>
                  {`${name} ${surname}`}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <Button
            type="submit"
            id="button-primary"
            disabled={isLoading}
            variant="contained"
          >
            {isLoading && <CircularProgress size={16} />}
            {!isLoading && "Cadastrar"}
          </Button>
        </form>
      </Permission>
    </Modal>
  );
}
