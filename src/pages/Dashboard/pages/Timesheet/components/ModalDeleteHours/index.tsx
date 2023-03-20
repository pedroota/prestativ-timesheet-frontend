import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHours } from "services/hours.service";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalDeleteHoursProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentHour: string;
}

export function ModalDeleteHours({
  isOpen,
  setIsOpen,
  currentHour,
}: ModalDeleteHoursProps) {
  const queryClient = useQueryClient();
  // Delete user Mutation
  const { mutate } = useMutation((_id: string) => deleteHours(_id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["hours"]);
      setIsOpen((prevState) => !prevState);
      toast.success("Este lançamento de horas foi deletado!");
    },
    onError: () => {
      toast.error("Ocorreu algum erro ao deletar este lançamento de horas!");
    },
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setIsOpen((prevState) => !prevState)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          Você realmente deseja deletar este Lançamento de Horas?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Esta operação não poderá ser desfeita!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsOpen((prevState) => !prevState)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => mutate(currentHour)}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
