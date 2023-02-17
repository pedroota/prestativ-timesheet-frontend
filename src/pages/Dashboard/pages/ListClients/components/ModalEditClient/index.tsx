import { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  TextField,
  Box,
  Typography,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByRole } from "services/auth.service";
import { Clients, RegisterClients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { getClientById, updateClient } from "services/clients.service";
import cep from "cep-promise";
import { Permission } from "components/Permission";
import { currencyMask } from "utils/masks";
import { toast } from "react-toastify";

interface ModalEditUserProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentClient: string;
}

export function ModalEditClient({
  isOpen,
  setIsOpen,
  currentClient,
}: ModalEditUserProps) {
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [gpClient, setGpClient] = useState("");
  const [valueCep, setValueCep] = useState("");
  const { data } = useQuery(
    ["clients", currentClient],
    () => getClientById(currentClient),
    {
      onSuccess: ({ data }) => {
        data.client.valueClient && setPrice(`${data.client.valueClient}`);
        reset(data.client);
      },
    }
  );
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    ({
      code,
      name,
      cnpj,
      cep,
      street,
      city,
      state,
      district,
      streetNumber,
      complement,
      periodIn,
      periodUntil,
      billingLimit,
      payDay,
      gpClient,
    }: RegisterClients) =>
      updateClient(currentClient, {
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
        queryClient.invalidateQueries(["clients"]);
        setIsOpen((prevState) => !prevState);
        toast.success("Cliente foi atualizado com sucesso!");
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao editar este cliente!", {
          autoClose: 1500,
        });
      },
    }
  );
  const { data: listGps } = useQuery(["users-gp", "gpClient"], () =>
    getUserByRole("gerenteprojetos")
  );

  const { register, reset, handleSubmit, setValue } = useForm<Clients>();

  const onSubmit = handleSubmit(
    ({
      code,
      name,
      cnpj,
      street,
      city,
      state,
      district,
      streetNumber,
      complement,
      periodIn,
      periodUntil,
      billingLimit,
      payDay,
      valueClient,
      gpClient,
    }) => {
      mutate({
        code,
        name,
        cnpj,
        cep: valueCep,
        street,
        city,
        state,
        district,
        streetNumber,
        complement,
        periodIn,
        periodUntil,
        billingLimit,
        payDay,
        valueClient,
        gpClient,
      });
      reset();
    }
  );

  const setNewPrice = (value: string) => {
    const stringValueWithoutDots = value.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
  };

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

  return (
    <Permission roles={["EDITAR_CLIENTE"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar cliente</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <TextField
              required
              color="warning"
              label="Código do cliente"
              type="text"
              InputLabelProps={{ shrink: true }}
              {...register("code")}
            />
            <TextField
              required
              color="warning"
              label="Nome / Razão Social"
              type="text"
              InputLabelProps={{ shrink: true }}
              {...register("name")}
            />
            <TextField
              required
              color="warning"
              label="CNPJ"
              InputLabelProps={{ shrink: true }}
              type="text"
              {...register("cnpj")}
            />
            <p>Endereço do cliente</p>
            <div className="c-register-client--input-container">
              <TextField
                value={data?.data.client && data?.data.client.cep}
                required
                color="warning"
                sx={{ width: "100%" }}
                label="CEP"
                InputLabelProps={{ shrink: true }}
                type="text"
                onChange={(event) => setValueCep(event.target.value)}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Logradouro"
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                {...register("city")}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Estado"
                InputLabelProps={{ shrink: true }}
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
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Número"
                InputLabelProps={{ shrink: true }}
                type="text"
                {...register("streetNumber")}
              />
              <TextField
                color="warning"
                sx={{ width: "100%" }}
                label="Complemento"
                type="text"
                InputLabelProps={{ shrink: true }}
                {...register("complement")}
              />
            </div>
            <p>Período de faturamento</p>
            <div className="c-register-client--input-container">
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                InputLabelProps={{ shrink: true }}
                label="De"
                type="text"
                {...register("periodIn")}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Até"
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                {...register("billingLimit")}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Dia de pagamento"
                type="text"
                {...register("payDay")}
                InputLabelProps={{ shrink: true }}
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
                value={currencyMask(price)}
                {...register("valueClient")}
                InputLabelProps={{ shrink: true }}
                onChange={(event) => setNewPrice(event.target.value)}
              />
              <TextField
                color="warning"
                {...register("gpClient")}
                label="Gerente de Projetos"
                select
                value={gpClient}
                onChange={(event) => setGpClient(event.target.value)}
              >
                <MenuItem value="">Selecione uma opção</MenuItem>
                {listGps?.data.map(({ name, surname, _id }: UserRegister) => (
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
              {!isLoading && "Concluído"}
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}
