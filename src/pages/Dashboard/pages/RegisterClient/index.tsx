import { Button, FormControl, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

export function RegisterClient() {
  const { register, handleSubmit } = useForm();
  // async function handleChange(event: any) {
  //   const tamanho = event.target.value.length;
  //   console.log(tamanho);
  //   if (tamanho == 8) {
  //     console.log(event.target.value);
  //     await fetch(`https://viacep.com.br/ws/${event.target.value}/json/`).then(
  //       async (response) => {
  //         console.log(response.json());
  //       }
  //     );
  //   }
  // }

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="c-register-client" onSubmit={onSubmit}>
      <h1 className="c-register-client--title">Cadastrar novo cliente</h1>
      <p>Informações gerais</p>
      <TextField
        required
        color="warning"
        label="Código do cliente"
        type="text"
        {...register("clientCode")}
      />
      <TextField
        required
        color="warning"
        label="Nome / Razão Social"
        type="text"
        {...register("nameSocial")}
      />
      <TextField
        required
        color="warning"
        label="CNPJ"
        type="text"
        {...register("clientCNPJ")}
      />
      <p>Endereço do cliente</p>
      <div className="c-register-client--input-container">
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="CEP"
          type="text"
          {...register("clientCEP")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Logradouro"
          type="text"
          {...register("clientLogradouro")}
        />
      </div>
      <div className="c-register-client--input-container">
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Cidade"
          type="text"
          {...register("clientCidade")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Estado"
          type="text"
          {...register("clientEstado")}
        />
      </div>
      <div className="c-register-client--input-container">
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Bairro"
          type="text"
          {...register("clientBairro")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Número"
          type="text"
          {...register("clientNúmero")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Complemento"
          type="text"
          {...register("clientComplemento")}
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
          {...register("clientFaturamentoDe")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Até"
          type="text"
          {...register("clientFaturamentoAte")}
        />
      </div>
      <div className="c-register-client--input-container">
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Dia limite de faturamento"
          type="text"
          {...register("clientFaturamentoDia")}
        />
        <TextField
          required
          color="warning"
          sx={{ width: "100%" }}
          label="Dia de pagamento"
          type="text"
          {...register("clientDiaPagamento")}
        />
      </div>
      <Button type="submit" id="button-primary" variant="contained">
        Cadastrar
      </Button>
    </form>
  );
}
