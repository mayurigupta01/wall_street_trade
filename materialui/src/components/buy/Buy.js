import * as React from "react";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import axios from "axios";
import { Component } from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import debounce from "lodash.debounce";
import BuyDialog from "./buyDialog";
import SellDialog from "./sellDialog";
import successAlert from "../alert/successAlert";
import "./buy.css";

const Buy = () => {
  const [openBuy, setOpenBuy] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [apidata, setAPIData] = useState(null);
  const [apidatabool, setAPIDatabool] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [totalPrice, setTotalPrice] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [credit, setCredit] = useState(0);
  const [buy_price, setBuyPrice] = useState(0); //set it with real
  const user_data = JSON.parse(localStorage.getItem("isLoggedIn"));
  const user_id = user_data.user_id;

  //API call
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  //style

  const style = {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    border: "5px solid #000",
    boxShadow: 24,
    p: 5,
    fontSize: "16px",
  };

  const Item = styled(Paper)(({ theme }) => ({
    textAlign: "center",
    padding: "8px",
  }));

  const handleClose = (e) => {
    setShowModal(false);
  };

  const handleBuyOpen = (e) => {
    setOpenBuy(true);
    setShowModal(false);
  };

  const handleBuyClose = (e) => {
    setOpenBuy(false);
  };

  const handleSellClose = (e) => {
    setOpenSell(false);
  };

  const handleSellOpen = (e) => {
    setOpenSell(true);
    setShowModal(false);
  };

  const handleSearch = (e) => {
    const Symbol = { symbol };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Symbol),
    };
    fetch("/stock/info", requestOptions)
    // .then((response) => {
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        } 
        return res.json();
      })
      .then(data => {
        setIsPending(false);
        setAPIData(data);
        console.log(data);
        setError(null);
        setAPIDatabool(true)
      })
      .catch(err => {
        // auto catches network / connection error
        if(err.name === "AbortError"){
            console.log("Aborted")
        }
        else{
        setIsPending(false);
        setError(err.message);
        }
      })
      // console.log(respons  e.status);
    //   if (response.status === 200) {setAPIDatabool(true);}
    //   response.json().then((res) => {
    //     console.log(res);
    //     setAPIData(res);

    //   });
    // });
    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    };
    fetch("/realtime/stock/price", request).then((response) => {
      response.json().then((res) => {
        console.log("inside real stock price inside handle search");
        console.log(res);
        setBuyPrice(res.currentStockPrice);
      });
    });

    setShowModal(true);
  };

  return (
    <div>
      <div className="Search">
        <div>
          <TextField
            id="outlined-full-width"
            label="Label"
            style={{
              margin: 8,
              background: "white",
              fontColor: "white",
              width: 1000,
              //  backgroundColor: "white",
            }}
            placeholder="Placeholder"
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* SEARCH MODAL */}

      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {apidatabool ? (
            <div>
              <Typography
                id="modal-modal-title"
                variant="h2"
                component="h2"
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  paddingBottom: "10px",
                }}
              >
                {symbol}
              </Typography>
              {/* <div style={{paddingBottom: "25px"}}>
                {apidata.Business Summary}
              </div> */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Item>
                    <strong>Industry:</strong> {apidata.industry}
                  </Item>
                </Grid>

                <Grid item xs={4}>
                  <Item>
                    <strong>Recommendation:</strong> {apidata.recommendation}
                  </Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>
                    <strong>Today's High:</strong> ${apidata.MarketDayHigh}
                  </Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>
                    <strong>High:</strong> ${apidata.targetHighPrice}
                  </Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>
                    <strong>Low:</strong> ${apidata.targetLowPrice}
                  </Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>
                    <strong>52 Week High:</strong> {apidata["52TwoWeekHigh"]}
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <strong>52 Week Low:</strong> ${apidata["52TwoWeekLow"]}
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <strong>Market Cap:</strong> ${apidata.MarketCap}
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <strong>Volume:</strong> {apidata.Volume}
                  </Item>
                </Grid>
                <div className ="buybuttons"></div>
                <Grid item xs={3}>
                <Item>
                <button
                  className="buyButton"
                  variant="outlined"
                  onClick={handleBuyOpen}
                >
                  Buy
                </button>
                </Item>
                </Grid>
                
                <Grid   item xs={3}>
                <Item>

                <button
                  className="buyButton"
                  variant="outlined"
                  onClick={handleSellOpen}
                >
                  Sell
                </button>
                </Item>
                </Grid>
              </Grid>
            </div>
          ) : (
            <Typography style={{ textAlign: "center", fontSize: "16px" }}>
              {" "}
              {symbol.toUpperCase()}, is invalid or cannot be found!{" "}
            </Typography>
          )}
        </Box>
      </Modal>
      <BuyDialog
        open={openBuy}
        close={() => setOpenBuy(false)}
        symbol={symbol}
        price={buy_price}
      ></BuyDialog>

      <SellDialog
        open={openSell}
        close={() => setOpenSell(false)}
        symbol={symbol}
        price={buy_price}
      ></SellDialog>
    </div>
  );
};

export default Buy;
