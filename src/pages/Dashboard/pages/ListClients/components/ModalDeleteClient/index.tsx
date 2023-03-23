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
import { deleteClient, getClientById } from "services/clients.service";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalDeleteClientProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentClient: string;
}

export function ModalDeleteClient({
  isOpen,
  setIsOpen,
  currentClient,
}: ModalDeleteClientProps) {
  const queryClient = useQueryClient();

  // Delete client Mutation
  const { mutate } = useMutation((id: string) => deleteClient(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
      setIsOpen((prevState) => !prevState);
      toast.success("Este cliente foi deletado!");
    },
    onError: () => {
      toast.error("Ocorreu algum erro ao deletar este cliente!");
    },
  });

  const verifyBeforeDelete = async () => {
    const client = await getClientById(currentClient);
    if (client?.data.client.projects.length > 0) {
      setIsOpen((prevState) => !prevState);
      return toast.error(
        "Não é possível deletar esse cliente pois ele está vinculado com projetos"
      );
    } else {
      mutate(currentClient);
    }
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setIsOpen((prevState) => !prevState)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Você realmente deseja deletar este Cliente?</DialogTitle>
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
            onClick={() => verifyBeforeDelete()}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
