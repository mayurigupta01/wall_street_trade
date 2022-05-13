import * as React from "react";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
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
import debounce from "lodash.debounce";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';
import "./buy.css";

const SellDialog = (prop) => {
  // const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [totalPrice, setTotalPrice] = useState(0);
  // const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [credit, setCredit] = useState(0);
  // const [buy_price, setBuyPrice] = useState(100); //set it with real
  const user_data = JSON.parse(localStorage.getItem("isLoggedIn"));
  const user_id = user_data.user_id;
  const [message, setMessage] = useState("");

  console.log(prop);

  //alert
  const [openAlert, setOpenAlert] = React.useState(false);

  //API call
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);


  const [openPop, setOpenPop] = React.useState(false);

  const handleClickPop = () => {
    setOpenPop(true);
  };

  const handleClosePopup = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenPop(false);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(Symbol),
    };
    fetch(`/get_user_credits/` + user_id, { requestOptions }).then(
      (response) => {
        response.json().then((res) => {
          // console.log(res);
          // console.log(res.Available_balance);
          setCredit(res.Available_balance);
        });
      }
    );
  }, []);

  const handleBuy = (e) => {
    const symbol = prop.symbol;
    const sell_price = prop.price;
    const buy = { user_id, symbol, quantity, sell_price };
    console.log(JSON.stringify(buy));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buy),
    };
    fetch("/sellstock", requestOptions)
      .then((res) => {
        if (!res.ok) {
          // error coming back from server
          throw Error("could not fetch the data for that resource");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
        setIsPending(false);
        setError(null);
        setOpenPop(true);
      })
      .catch((err) => {
        // auto catches network / connection error
        if (err.name === "AbortError") {
          console.log("Aborted");
        } else {
          setIsPending(false);
          setError(err.message);
        }
      });
  };

  const styles = (theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 16,
    },
    menu: {
      width: 200,
    },
  });

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={prop.open}
        onClose={prop.close}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        aria-labelledby="buy"
      >
        <DialogTitle id="buy">Sell {prop.symbol}</DialogTitle>

        <DialogContent>
          <DialogContentText
            className="Ptext"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <p>Stock: {prop.symbol}</p>
            <p>Symbol: {prop.symbol}</p>
            <p>Price: ${prop.price}</p>
            <p>Credits: ${credit}</p>
            <p>Total Price: ${prop.price * quantity}</p>
            <TextField
              sx={{
                display: "flex",
                flexDirection: "column",
                m: "auto",
                width: "10em",
                font: "icon",
                fontFamily: "Source Sans Pro",
              }}
              type="number"
              name="share"
              label="Share Quantity"
              variant="filled"
              InputProps={{ inputProps: { min: 0, max: 10 } }}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleBuy} autoFocus>
            Sell
          </Button>
        </DialogActions>
      </Dialog>
      {/* 
            { isPending && <div>Loading...</div>}
            { error && <div>{error}...</div>} */}
      {data && (
        <div>
          {/* <Alert icon={true} severity="info">
                {data.Message}
                </Alert> */}
          <Snackbar
            open={openPop}
            autoHideDuration={6000}
            onClose={handleClosePopup}
          >
            <Alert
              onClose={handleClosePopup}
              severity="success"
              sx={{ width: "100%" }}
            >
              Sell Successfull!
            </Alert>
          </Snackbar>
        </div>
      )}
    </div>
  );
};
export default SellDialog;
