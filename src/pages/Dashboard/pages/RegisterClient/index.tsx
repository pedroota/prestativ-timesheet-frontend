import { Button, MenuItem, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Clients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserByRole } from "services/auth.service";
import { createClients } from "services/clients.service";
import { cepMask, cnpjMask, currencyMask } from "utils/masks";
import { validateCNPJ } from "utils/validator";
import cep from "cep-promise";
import { Permission } from "components/Permission";

export function RegisterClient() {
  const [valueCep, setValueCep] = useState("");
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
      valueClient,
      gpClient,
    }) => {
      if (validateCNPJ(cnpj)) {
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
        })
          .then(() => {
            reset();
            toast.success("Cliente criado com sucesso.");
          })
          .catch(() => toast.error("Erro ao cadastrar o cliente."));
      } else {
        toast.error("O CNPJ digitado é inválido.");
      }
    }
  );

  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    setPrice(stringValue);
    setPriceNumber(Number(stringValue.slice(2)));
  };

  return (
    <Permission roles={["CADASTRO_CLIENTE"]}>
      <form className="c-register-client" onSubmit={onSubmit}>
        <h1 className="c-register-client--title">Cadastrar novo cliente</h1>
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
            sx={{ width: "100%" }}
            {...register("gpClient")}
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
            {data?.data.map(({ name, surname, _id }: UserRegister) => (
              <MenuItem value={_id} key={_id}>
                {`${name} ${surname}`}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Button type="submit" id="button-primary" variant="contained">
          Cadastrar
        </Button>
      </form>
    </Permission>
  );
}
