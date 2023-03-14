import { useState } from "react";
import { Button, MenuItem, TextField, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Permission } from "components/Permission";
import { toast } from "react-toastify";
import { Modal } from "components/ModalGeneral";
import { getAllUsers } from "services/auth.service";
import { UserInfo } from "interfaces/users.interface";
import { getBusinessById, updateBusiness } from "services/business.service";
import {
  BusinessUnit,
  BusinessUnitRegister,
} from "interfaces/business.interface";

interface ModalEditBusinessProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentBusiness: string;
}

export function ModalEditBusiness({
  isOpen,
  setIsOpen,
  currentBusiness,
}: ModalEditBusinessProps) {
  const [nameBU, setNameBU] = useState("");
  const [relUser, setRelUser] = useState("");
  const queryClient = useQueryClient();

  useQuery(
    ["business", currentBusiness],
    () => getBusinessById(currentBusiness),
    {
      onSuccess: ({ data }) => {
        console.log(data);
        data.businessUnit.nameBU && setNameBU(data.businessUnit.nameBU);
        data.businessUnit.relUser && setRelUser(data.businessUnit.relUser._id);
      },
    }
  );
  const { data: users } = useQuery(["users"], () => getAllUsers());

  const { mutate, isLoading } = useMutation(
    () =>
      updateBusiness(currentBusiness, {
        nameBU: nameBU.trim(),
        relUser: relUser,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["business"]);
        setIsOpen((prevState) => !prevState);
        toast.success("Atualização feita com sucesso!");
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao editar este BU!", {
          autoClose: 1500,
        });
      },
    }
  );

  const { handleSubmit } = useForm<BusinessUnitRegister>();

  const onSubmit = handleSubmit(() => {
    mutate();
    setNameBU("");
    setRelUser("");
  });

  return (
    <Permission roles={["EDITAR_BU"]}>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Editar Business Unit">
        <form className="c-form-spacing" onSubmit={onSubmit}>
          <p>Informações do Business Unit</p>
          <TextField
            label="Nome do Business Unit"
            color="warning"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={nameBU}
            onChange={(event) => setNameBU(event.target.value)}
          />
          <TextField
            color="warning"
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
            sx={{ paddingBlock: "1rem" }}
            variant="contained"
            color="warning"
            type="submit"
          >
            {isLoading && <CircularProgress size={16} />}
            {!isLoading && "Concluído"}
          </Button>
        </form>
      </Modal>
    </Permission>
  );
}
