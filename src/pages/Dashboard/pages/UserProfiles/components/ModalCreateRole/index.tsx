import { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Permission as Permissions } from "enums/Permissions";
import { Permission } from "components/Permission";
import { SelectChangeEvent } from "@mui/material/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoles } from "services/roles.service";
import { Roles } from "interfaces/roles.interface";
import TableBody from "@mui/material/TableBody/TableBody";
import { StyledTableRow } from "components/StyledTableRow";
import { StyledTableCell } from "components/StyledTableCell";
import Table from "@mui/material/Table/Table";
import TableHead from "@mui/material/TableHead/TableHead";
import TableRow from "@mui/material/TableRow/TableRow";
import { SwitchIOS } from "components/SwitchIOS";

interface ModalCreateRoleProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

interface FormCreateRoles {
  name: string;
  permissions: string;
}

export function ModalCreateRole({ isOpen, setIsOpen }: ModalCreateRoleProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ({ name, permissions }: Pick<Roles, "name" | "permissions">) =>
      createRoles({ name, permissions }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["roles"]);
        reset();
        setMultipleSelectValue([]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );
  const [multipleSelectValue, setMultipleSelectValue] = useState<string[]>([]);
  const { register, handleSubmit, reset } = useForm<FormCreateRoles>();

  const onSubmit = handleSubmit(({ name }) => {
    mutate({ name, permissions: multipleSelectValue });
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
    <Permission roles={["CRIAR_PERFIL"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4, minWidth: 420 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Criar perfil</Typography>
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
              label="Nome do perfil"
              type="text"
              InputLabelProps={{ shrink: true }}
              {...register("name")}
            />
            <Select
              value={multipleSelectValue}
              {...register("permissions")}
              onChange={handleMultipleSelectChange}
              multiple
            >
              {Object.values(Permissions).map((permission, index) => (
                <MenuItem value={permission} key={index}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              sx={{ paddingBlock: "1rem" }}
            >
              Criar perfil
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}
