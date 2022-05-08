import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { Component } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const Buy = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const [totalPrice, setTotalPrice] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open responsive dialog
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Buy Nvdia</DialogTitle>

        <DialogContent>
          <DialogContentText>
            <p>Stock: NVDIA</p>
            <p>Symbol: NVDA</p>
            <p>Price: 80$</p>
            {/* <InputLabel shrink>Count</InputLabel> */}
            {/* <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} /> */}
            <TextField
              type="number"
              name="share"
              label="Share Quantity"
              variant="filled"
              InputProps={{ inputProps: { min: 0, max: 10 } }}
            //   value={inputField.share}
            //   onChange={(event) => handleChangeInput(inputField.id, event)}
            />
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          {/* <Button autoFocus onClick={handleClose}>
            Disagree
          </Button> */}

          <Button onClick={handleClose} autoFocus>
            Buy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Buy;
