import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import FormLabel from "@mui/material/FormLabel/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import cep from "cep-promise";
import { Modal } from "components/ModalGeneral";
import { Permission } from "components/Permission";
import { BusinessUnitModals } from "interfaces/business.interface";
import { Clients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserByRole } from "services/auth.service";
import { getBusiness } from "services/business.service";
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
  const [idBusinessUnit, setIdBusinessUnit] = useState("");
  const [gpClient, setGpClient] = useState<string[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm<Clients>({});
  const { data } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );
  const { data: businessUnitList } = useQuery(["business"], () =>
    getBusiness()
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
      corporateName,
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
    }: Clients) =>
      createClients({
        corporateName,
        name: name.trim(),
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
        gpClient: gpClient,
        businessUnit: idBusinessUnit,
      }),
    {
      onSuccess: () => {
        reset();
        setValueCep("");
        setValues({ cnpj: "" });
        setPrice("");
        setIdBusinessUnit("");
        setGpClient([]);
        toast.success("Cadastro de cliente efetuado com sucesso!");
        setIsOpen((prevState) => !prevState);
      },
      onError: (err: any) => {
        toast.error(err.response.data.message, {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({
      corporateName,
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
    }) => {
      // Validates CNPJ
      if (!validateCNPJ(cnpj)) {
        return toast.error("O CNPJ digitado é inválido", { autoClose: 1500 });
      }
      mutate({
        corporateName,
        name: name.trim(),
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
        gpClient: gpClient,
        businessUnit: idBusinessUnit,
      });
    }
  );

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    const stringValueWithoutDots = stringValue.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
  };

  const multipleSelectGPChange = (
    event: SelectChangeEvent<typeof gpClient>
  ) => {
    setGpClient(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Cadastrar novo cliente">
      <Permission roles={["CADASTRO_CLIENTE"]}>
        <form className="c-register-client" onSubmit={onSubmit}>
          <p>Informações gerais</p>
          <TextField
            required
            color="warning"
            label="Razão Social"
            type="text"
            {...register("corporateName")}
          />
          <TextField
            required
            color="warning"
            label="Nome Fantasia"
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
          </div>
          <div className="c-register-activity--input-container">
            <FormLabel
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              }}
            >
              Gerentes De Projetos (Selecione no mínimo uma opção)
              <Select
                color="warning"
                variant="outlined"
                {...register("gpClient")}
                sx={{ width: "100%" }} // maxWidth: "14rem"
                value={gpClient}
                onChange={multipleSelectGPChange}
                multiple
              >
                <MenuItem value="" disabled>
                  Selecione no mínimo uma opção
                </MenuItem>
                {data?.data.map(({ name, surname, _id }: UserRegister) => (
                  <MenuItem value={_id} key={_id}>
                    {`${name} ${surname}`}
                  </MenuItem>
                ))}
              </Select>
            </FormLabel>
          </div>
          <div className="c-register-activity--input-container">
            <FormLabel
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              }}
            >
              Business Unit
              <Select
                color="warning"
                variant="outlined"
                sx={{ width: "100%" }} // maxWidth: "14rem"
                value={idBusinessUnit}
                onChange={(event) => setIdBusinessUnit(event.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione uma opção (campo opicional)
                </MenuItem>
                <MenuItem value="">
                  <p>Nenhum B.U.</p>
                </MenuItem>
                {businessUnitList?.data.map(
                  ({ _id, nameBU }: BusinessUnitModals) => (
                    <MenuItem key={_id} value={_id}>
                      {nameBU}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormLabel>
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
