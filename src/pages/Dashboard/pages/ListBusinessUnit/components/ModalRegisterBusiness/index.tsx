import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "components/ModalGeneral";
import { Permission } from "components/Permission";
import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import { UserInfo } from "interfaces/users.interface";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getAllUsers } from "services/auth.service";
import { BusinessUnit } from "interfaces/business.interface";
import { createBusiness } from "services/business.service";

interface ModalRegisterBusinessProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalRegisterBusiness({
  isOpen,
  setIsOpen,
}: ModalRegisterBusinessProps) {
  const [relUser, setRelUser] = useState("");
  const { data: users } = useQuery(["users"], () => getAllUsers());

  const { register, handleSubmit, reset } = useForm<BusinessUnit>({});

  const { mutate, isLoading } = useMutation(
    ({ nameBU, relUser }: BusinessUnit) =>
      createBusiness({
        nameBU,
        relUser,
      }),
    {
      onSuccess: () => {
        reset();
        setRelUser("");
        toast.success("Business Unit criado com sucesso.");
        setIsOpen((prevState) => !prevState);
      },
      onError: () => {
        toast.error("Erro ao criar o Business Unit.", {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit(({ nameBU, relUser }) => {
    mutate({
      nameBU: nameBU.trim(),
      relUser,
    });
  });

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Cadastrar Business Unit"
    >
      <Permission roles={["CADASTRO_BU"]}>
        <form className="c-register-project" onSubmit={onSubmit}>
          <p>Informações do Business Unit</p>
          <TextField
            label="Nome do Business Unit"
            {...register("nameBU")}
            color="warning"
            variant="outlined"
          />
          <TextField
            color="warning"
            {...register("relUser")}
            label="Usuário"
            select
            value={relUser}
            onChange={(event) => setRelUser(event.target.value)}
          >
            <MenuItem value="">Selecione uma opção</MenuItem>
            {users?.data.map(({ name, surname, _id }: UserInfo) => (
              <MenuItem key={_id} value={_id}>
                {`${name} ${surname}`}
              </MenuItem>
            ))}
          </TextField>
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
