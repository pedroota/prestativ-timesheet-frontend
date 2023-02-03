import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UserRegister } from "interfaces/users.interface";
import { getRoles } from "services/roles.service";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Roles } from "interfaces/roles.interface";
import { getUserById, updateUser } from "services/auth.service";

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
  useQuery(["users", currentUser], () => getUserById(currentUser), {
    onSuccess: ({ data }) => {
      const userData: UserRegister = data.user;
      userData.password = "";
      reset(userData);
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ({ name, surname, email, password, role, typeField }: UserRegister) =>
      updateUser(currentUser, {
        name,
        surname,
        email,
        password,
        role,
        typeField,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", "user"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );
  const { data } = useQuery(["roles"], getRoles);
  const { register, reset, handleSubmit } = useForm<UserRegister>();

  const onSubmit = handleSubmit(
    ({ name, surname, email, password, role, typeField }) => {
      mutate({ name, surname, email, password, role, typeField });
      reset();
    }
  );

  return (
    <div>
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
              label="Campo Relacionado"
              type="typeField"
              {...register("typeField")}
            >
              <MenuItem value={"nenhum"} key={0}>
                Não se aplica
              </MenuItem>
              <MenuItem value={"gerenteprojetos"} key={1}>
                Gerente de Projetos
              </MenuItem>
              <MenuItem value={"consultor"} key={2}>
                Consultor
              </MenuItem>
            </TextField>
            <Select
              {...register("role")}
              labelId="select-label-helper"
              label="Permissão"
              color="warning"
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {data?.data.map((role: Roles) => (
                <MenuItem value={role?._id} key={role?._id}>
                  {role?.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              sx={{ paddingBlock: "1rem" }}
              variant="contained"
              color="warning"
              type="submit"
            >
              Concluído
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
