import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Clients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getUserByRole } from "services/auth.service";
import { createClients } from "services/clients.service";

export function RegisterClient() {
  async function buscarData(event: any) {
    const tamanho = event.target.value.length;
    if (tamanho == 8) {
      const APIResponse = await fetch(
        `https://viacep.com.br/ws/${event.target.value}/json/`
      );
      if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        setDadosEndereco([
          data.logradouro,
          data.localidade,
          data.uf,
          data.bairro,
        ]);
      }
    }
  }

  const [dadosEndereco, setDadosEndereco] = useState(["", "", "", ""]);
  // rua - cidade - estado - bairro

  const { data } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  console.log(data);
  const { register, handleSubmit, reset } = useForm<Clients>({});

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
      }).then(() => {
        reset();
      });
    }
  );

  // Só chama a função createClient() e manda esses dados ai, desse jeito {name, etc...}
  // Embaixo, ali no formulário, corrige os campos, adiciona certinho as propriedades dentro dos ...register() e adiciona os campos que faltam (caso tenha)
  // Verifica e testa TUDO antes de enviar para o GitHub
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
          onChange={(e) => {
            buscarData(e);
          }}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          value={dadosEndereco[0]}
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
          value={dadosEndereco[1]}
          label="Cidade"
          type="text"
          {...register("city")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          value={dadosEndereco[2]}
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
          value={dadosEndereco[3]}
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
        <Select
          required
          labelId="select-label-helper"
          label="Gerente de Projetos"
          color="warning"
          sx={{ width: "100%" }}
          {...register("gpClient")}
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {data?.data.map(({ name, surname }: UserRegister) => (
            <MenuItem value={name + " " + surname} key={name + " " + surname}>
              {name + " " + surname}
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
