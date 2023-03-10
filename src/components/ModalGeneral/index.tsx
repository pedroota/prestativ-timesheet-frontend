import { Dispatch, SetStateAction, ReactNode } from "react";
import { Dialog, Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, setIsOpen, title, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen((prevState) => !prevState)}>
      <Box sx={{ minWidth: 400, p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBlock: "1rem",
          }}
        >
          <Typography fontSize="1.5rem">{title}</Typography>
          <Close
            fontSize="large"
            sx={{ cursor: "pointer" }}
            onClick={() => setIsOpen((prevState) => !prevState)}
          />
        </Box>
        {children}
      </Box>
    </Dialog>
  );
}
