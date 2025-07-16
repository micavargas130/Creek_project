// src/components/dialogs/CommentDialog.jsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const CommentDialog = ({
  open,
  onClose,
  onSubmit,
  text,
  setText
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ingresar comentario</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Comentario"
          variant="outlined"
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onSubmit} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
