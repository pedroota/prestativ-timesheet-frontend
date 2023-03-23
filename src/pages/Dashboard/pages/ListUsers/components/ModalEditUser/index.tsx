import { useState } from "react";
import {
  Button,
  MenuItem,
  TextField,
  Box,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UserRegister } from "interfaces/users.interface";
import { getRoles } from "services/roles.service";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Roles } from "interfaces/roles.interface";
import { getUserById, updateUser } from "services/auth.service";
import { Permission } from "components/Permission";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface ModalEditUserProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: string;
}

export function ModalEditUser({
  isOpen,
  setIsOpen,
  currentUser,
}: ModalEditUserProps) {
  const [currentProfile, setCurrentProfile] = useState("");
  const [currentTypefield, setCurrentTypefield] = useState("");
  useQuery(["users", currentUser], () => getUserById(currentUser), {
    onSuccess: ({ data }) => {
      const userData: UserRegister = data.user;
      userData.password = "";
      reset(userData);
      data?.user.role && setCurrentProfile(data.user.role._id);
      data?.user.typeField && setCurrentTypefield(data.user.typeField);
    },
  });
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    ({ name, surname, email, password, role, typeField }: UserRegister) =>
      updateUser(currentUser, {
        name: name?.trim(),
        surname: surname?.trim(),
        email: email?.trim(),
        password,
        role,
        typeField,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", "user"]);
        setIsOpen((prevState) => !prevState);
        toast.success("Usuário foi atualizado com sucesso!");
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao editar este Usuário!", {
          autoClose: 1500,
        });
      },
    }
  );
  const { data } = useQuery(["roles"], getRoles);
  const { register, reset, handleSubmit } = useForm<UserRegister>();

  const onSubmit = handleSubmit(
    ({ name, surname, email, password, role, typeField }) => {
      mutate({
        name: name?.trim(),
        surname: surname?.trim(),
        email: email?.trim(),
        password,
        role,
        typeField,
      });
      reset();
    }
  );

  return (
    <Permission roles={["EDITAR_USUARIO"]}>
      <Modal open={isOpen} onClose={() => setIsOpen((prevState) => !prevState)}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar usuário</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <TextField
              label="Nome"
              color="warning"
              InputLabelProps={{ shrink: true }}
              sx={{ width: "100%" }}
              {...register("name")}
            />
            <TextField
              color="warning"
              label="Sobrenome"
              InputLabelProps={{ shrink: true }}
              sx={{ width: "100%" }}
              {...register("surname")}
            />
            <TextField
              color="warning"
              label="Email"
              type="email"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              {...register("email")}
            />
            <TextField
              color="warning"
              {...register("password")}
              label="Senha"
              InputLabelProps={{ shrink: true }}
              sx={{ width: "100%" }}
            />
            <TextField
              required
              color="warning"
              select
              defaultValue={"nenhum"}
              label="Campo Cadastral + Visibilidade"
              type="typeField"
              {...register("typeField")}
              value={currentTypefield}
              onChange={(event) => setCurrentTypefield(event.target.value)}
            >
              <MenuItem value={"nenhum"} key={0}>
                Não se aplica - Todos os Lançamentos
              </MenuItem>
              <MenuItem value={"gerenteprojetos"} key={1}>
                Gerente de Projetos - Apenas os Próprios Lançamentos
              </MenuItem>
              <MenuItem value={"consultor"} key={2}>
                Consultor - Apenas os Próprios Lançamentos
              </MenuItem>
            </TextField>
            <TextField
              required
              {...register("role")}
              label="Perfil"
              select
              color="warning"
              value={currentProfile}
              onChange={(event) => setCurrentProfile(event.target.value)}
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {data?.data.map((role: Roles) => (
                <MenuItem value={role?._id} key={role?._id}>
                  {role?.name}
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
        </Box>
      </Modal>
    </Permission>
  );
}
