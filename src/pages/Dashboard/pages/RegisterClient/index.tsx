import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Clients } from "interfaces/clients.interface";
import { useForm } from "react-hook-form";
import { getUserByRole } from "services/auth.service";

export function RegisterClient() {
  const { data } = useQuery("users", getUserByRole);
  const { register, handleSubmit } = useForm<Clients>({});

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
      // Só chama a função createClient() e manda esses dados ai, desse jeito {name, etc...}
      // Embaixo, ali no formulário, corrige os campos, adiciona certinho as propriedades dentro dos ...register() e adiciona os campos que faltam (caso tenha)
      // Verifica e testa TUDO antes de enviar para o GitHub
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
        {...register("cnpj")}
      />
      <p>Endereço do cliente</p>
      <div className="c-register-client--input-container">
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="CEP"
          type="text"
          {...register("cep")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
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
          label="Cidade"
          type="text"
          {...register("city")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
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
          label="Bairro"
          type="text"
          {...register("district")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Número"
          type="text"
          {...register("streetNumber")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
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
          color="warning"
          sx={{ width: "100%" }}
          label="Gerente de Projetos"
          type="text"
          {...register("gpClient")}
        />
        <Select
          labelId="select-label-helper"
          label="Permissão"
          color="warning"
          value=""
          defaultValue="Consultor"
          {...register("gpClient")}
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {data?.data.map(({ name }) => (
            <MenuItem value={name} key={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Button type="submit" id="button-primary" variant="contained">
        Cadastrar
      </Button>
    </form>
  );
}
