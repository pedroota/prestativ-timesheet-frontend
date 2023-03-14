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
import { toast } from "react-toastify";
import { deleteBusiness } from "services/business.service";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalDeleteBusinessProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentBusiness: string;
}

export function ModalDeleteBusiness({
  isOpen,
  setIsOpen,
  currentBusiness,
}: ModalDeleteBusinessProps) {
  const queryClient = useQueryClient();
  // Delete Mutation
  const { mutate } = useMutation((id: string) => deleteBusiness(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["business"]);
      setIsOpen((prevState) => !prevState);
      toast.success("Este Business Unit foi deletado!");
    },
    onError: () => {
      toast.error("Ocorreu algum erro ao deletar este Business Unit!");
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
          Você realmente deseja deletar este Business Unit?
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
            onClick={() => mutate(currentBusiness)}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
