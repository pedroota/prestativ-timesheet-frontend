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

export function DialogDeleting() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        Slide in alert dialog
      </Button>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setIsOpen((prevState) => !prevState)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Você realmente deseja deletar esses dados?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Esta operação não poderá ser desfeita!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen((prevState) => !prevState)}>
            Disagree
          </Button>
          <Button onClick={() => setIsOpen((prevState) => !prevState)}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
