import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalConfirmChanges {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ModalConfirmChanges({
  isOpen,
  setIsOpen,
  onCancel,
  onConfirm,
}: ModalConfirmChanges) {
  const handleCancel = () => {
    setIsOpen(false);
    onCancel();
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    onConfirm();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCancel}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Você deseja salvar todas as modificações?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Se escolher &quot;Cancelar&quot; ele voltará para a tela anterior
            com as modificações que já foram efetuadas. Se escolher
            &quot;Confirmar&quot; serão enviados os novos lançamentos, todas as
            modificações realizadas e as linhas que foram deletadas. Essa
            operação não poderá ser desfeita!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="success" onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
