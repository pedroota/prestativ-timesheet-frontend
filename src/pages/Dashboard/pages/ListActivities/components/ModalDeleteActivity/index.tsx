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
import { deleteActivity } from "services/activities.service";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalDeleteActivityProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentActivity: string;
}

export function ModalDeleteActivity({
  isOpen,
  setIsOpen,
  currentActivity,
}: ModalDeleteActivityProps) {
  const queryClient = useQueryClient();
  // Delete Activity Mutation
  const { mutate } = useMutation((id: string) => deleteActivity(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["activities"]);
      setIsOpen((prevState) => !prevState);
      toast.success("Esta atividade foi deletada!");
    },
    onError: () => {
      toast.error("Ocorreu algum erro ao deletar esta atividade!");
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
        <DialogTitle>Você realmente deseja deletar esta Atividade?</DialogTitle>
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
            onClick={() => mutate(currentActivity)}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
