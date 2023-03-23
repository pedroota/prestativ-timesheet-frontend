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
import { deleteRole } from "services/roles.service";
import { toast } from "react-toastify";
import { getAllUsers } from "services/auth.service";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalDeleteRoleProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentRole: string;
}

export function ModalDeleteRole({
  isOpen,
  setIsOpen,
  currentRole,
}: ModalDeleteRoleProps) {
  const queryClient = useQueryClient();
  // Delete role mutation
  const { mutate } = useMutation((_id: string) => deleteRole(_id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      setIsOpen((prevState) => !prevState);
      toast.success("Este perfil foi deletado!");
    },
    onError: () => {
      toast.error("Ocorreu algum erro ao deletar este perfil!");
    },
  });

  const verifyBeforeDelete = async () => {
    const users = await getAllUsers();

    const userWithCurrentRole = users.data.some(
      (user: { role: { _id: string } }) => user.role._id === currentRole
    );

    if (userWithCurrentRole) {
      setIsOpen((prevState) => !prevState);
      return toast.error(
        "Não é possível deletar esse perfil pois ele está vinculado com usuários"
      );
    } else {
      mutate(currentRole);
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
        <DialogTitle>Você realmente deseja deletar este Perfil?</DialogTitle>
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
