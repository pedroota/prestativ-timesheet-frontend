import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoleById, updateRoles } from "services/roles.service";
import { useForm } from "react-hook-form";
import { Permission as Permissions } from "enums/Permissions";
import { Permission } from "components/Permission";
import { Roles } from "interfaces/roles.interface";

interface ModalEditRoleProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentRole: string;
}

export function ModalEditRole({
  isOpen,
  setIsOpen,
  currentRole,
}: ModalEditRoleProps) {
  const queryClient = useQueryClient();
  const [multipleSelectValue, setMultipleSelectValue] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm();
  useQuery(["roles", currentRole], () => getRoleById(currentRole), {
    onSuccess({ data }) {
      reset(data);
      setMultipleSelectValue(data?.permissions);
    },
    enabled: !!currentRole,
  });

  const { mutate } = useMutation(
    ({ name, permissions }: Pick<Roles, "name" | "permissions">) =>
      updateRoles(currentRole, { name, permissions }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["roles"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );

  const onSubmit = handleSubmit((data) => {
    mutate({ name: data?.name, permissions: multipleSelectValue });
    reset();
  });

  const handleMultipleSelectChange = (
    event: SelectChangeEvent<typeof multipleSelectValue>
  ) => {
    const {
      target: { value },
    } = event;
    setMultipleSelectValue(
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <Permission roles={["EDITAR_PERFIL"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4, minWidth: "26.25rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar perfil</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <TextField
              color="warning"
              {...register("name")}
              label="Nome do cargo"
              InputLabelProps={{ shrink: true }}
            />
            <Select
              multiple
              value={multipleSelectValue}
              color="warning"
              onChange={handleMultipleSelectChange}
            >
              {Object.values(Permissions).map((permission, index) => (
                <MenuItem value={permission} key={index}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              type="submit"
              color="warning"
              sx={{ paddingBlock: "1rem" }}
            >
              Conluído
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}
