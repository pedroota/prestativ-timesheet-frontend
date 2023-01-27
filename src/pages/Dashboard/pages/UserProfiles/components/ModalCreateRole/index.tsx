import { Dialog, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { SetStateAction } from "react";

interface ModalCreateRoleProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

export function ModalCreateRole({ isOpen, setIsOpen }: ModalCreateRoleProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen((prevState) => !prevState)}>
      <Box sx={{ padding: 4, minWidth: 420 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontSize="1.3rem">Criar cargo</Typography>
          <Close
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={() => setIsOpen((prevState) => !prevState)}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
