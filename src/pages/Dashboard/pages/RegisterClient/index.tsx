import { Button, MenuItem, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCep } from "cep-hook";
import { Clients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserByRole } from "services/auth.service";
import { createClients } from "services/clients.service";
import { cepMask } from "utils/cepMask";
import { cnpjMask } from "utils/cnpjMask";
import { validateCNPJ } from "utils/validator";

export function RegisterClient() {
  const {
    register,
    handleSubmit,
    reset,
    setValue: setValueForm,
  } = useForm<Clients>({});
  const { data } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  const [value, setValue, getZip] = useCep("");

  useEffect(() => {
    getZip().then((res) => {
      setValueForm("street", `${res.logradouro}`);
      setValueForm("city", `${res.localidade}`);
      setValueForm("state", `${res.uf}`);
      setValueForm("district", `${res.bairro}`);
    });
  }, [value]);

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
          valueClient,
          gpClient,
        })
          .then(() => {
            reset(); // limpa quase todos os campos
            setValues({ cnpj: "" }); // limpa o campo de CNPJ
            setValue(""); // limpa o campo de CEP
            // unico campo que não consegui fazer limpar é o do Gerente de Projetos
            toast.success("Cliente criado com sucesso.");
          })
          .catch(() => toast.error("Erro ao cadastrar o cliente."));
      } else {
        toast.error("O CNPJ digitado é inválido.");
      }
    }
  );

  return (
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
          value={cepMask(value)}
          onChange={(event) => setValue(event.target.value)}
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
          {...register("valueClient")}
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
  );
}
