import * as React from "react";
import { Component } from "react";
import SearchBar from "material-ui-search-bar";
import styled from "styled-components";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import TextField from '@mui/material/TextField';
import Buy from "../buy/Buy.js"
import {withRouter} from '../withRouter';
import { useDispatch, useSelector } from "react-redux";
import { SetbuyStockSymbol, SetbuyStockPrice } from "../../redux/buyReducer";


// materialui\src\components\buy\Buy.js

const Item = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  padding: '8px',
}));



export const StyledSearchBar = styled(SearchBar)`
  margin: 0 auto;
  width: 70%;
  max-width: 800px;
  borderbottomcolor: "transparent";
  bordertopcolor: "transparent";`;

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  bgcolor: 'background.paper',
  border: '5px solid #000',
  boxShadow: 24,
  p: 5,
  fontSize: '16px'
};

// const btnStyle = { 
//   position: 'relative';
//     display: 'inline-block;
//     padding: 5px 5px;
//     color: black;
//     font-size: 16px;
//     text-decoration: none;
//     text-transform: uppercase;
//     overflow: hidden;
//     transition: .5s;
//     margin-top: 20px;
//     letter-spacing: 4px;
//     display: block
// }

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.yourFunctionHere=this.yourFunctionHere.bind(this);
    this.state = {
      value: "",
      apidata: null,
      showModal:false,     
    };
  }
// const dispatch = useDispatch();

  yourFunctionHere()
    {
        // dispatch(SetbuyStockPrice(state.apidata)["Price"]);
        // dispatch(SetbuyStockSymbol(state.apidata)["Symbol"]);
        this.props.navigate('/buy')
    }

  handleBuy = () => {
    
  }
  handleClose=()=>{
    console.log("Inside handle close");
    this.setState({showModal:false});
  }
  async handleRequestSearch() {
    let param = {
      search: this.state.value,
    };
    this.setState({showModal:true});
      const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param),
    };
    fetch("/get-stock-summary", requestOptions).then((response) => {
      response.json().then(res=>{
         this.setState({ apidata: res?res:[] });
      console.log(res);
      })
    });
  }
  render() {
    return (
      <>
      {/* <TextField
          id="standard-multiline-static"
          label="Stock Symbol"
          multiline
          // rows={4}
          defaultValue={this.state.value}
          onChange={(newValue) => this.setState({ value: newValue })}
          variant="standard"
        /> */}
      <SearchBar classname = "searchbar"
        value={this.state.value}
        onChange={(newValue) => this.setState({ value: newValue })}
        onRequestSearch={() => this.handleRequestSearch(this.state.value)}
      />
      <Button classname = "searchButton" variant="outlined"
        onClick={() => {this.handleRequestSearch(this.state.value)}}>Search</Button>
      <Modal
        open={this.state.showModal}
        onClose={this.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
      <IconButton
        aria-label="close"
        onClick={this.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
      <CloseIcon />
      </IconButton>
          {
            this.state.apidata ? 
            <div>
              <Typography id="modal-modal-title" variant="h2" component="h2" style={{textAlign: "center", textDecoration: "underline", paddingBottom: "10px"}}>
                {(this.state.apidata)["Symbol"]} ({(this.state.apidata)["Company"]})
              </Typography>
              <div style={{paddingBottom: "25px"}}>
                {this.state.apidata["Business Summary"]}
              </div>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Item><strong>Sector:</strong> {this.state.apidata["Sector"]}</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item><strong>Grade:</strong> {this.state.apidata["Grade"]}</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item><strong>Recommendation:</strong> {this.state.apidata["Recommendation"]}</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item><strong>Open:</strong> ${this.state.apidata["Open"]}</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item><strong>High:</strong> ${this.state.apidata["High"]}</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item><strong>Low:</strong> ${this.state.apidata["Low"]}</Item>
                </Grid>
                <Grid item xs={3}>
                  <Item><strong>52-Week High:</strong> ${this.state.apidata["52-Week High"]}</Item>
                </Grid>
                <Grid item xs={3}>
                  <Item><strong>52-Week Low:</strong> ${this.state.apidata["52-Week Low"]}</Item>
                </Grid>
                <Grid item xs={3}>
                  <Item><strong>Market Cap:</strong> ${this.state.apidata["Market Cap"]}</Item>
                </Grid>
                <Grid item xs={3}>
                  <Item><strong>Volume:</strong> {this.state.apidata["Volume"]}</Item>
                </Grid>
                <Grid item xs={12}>
                  <Item><strong>Similar Stocks:</strong> {this.state.apidata["Similar Stock 1"]} - {this.state.apidata["Similar Stock 2"]} - {this.state.apidata["Similar Stock 3"]}</Item>
                </Grid>
                <Grid>
                  <button 
                onClick={this.yourFunctionHere}
                >
                  Buy
                  </button>
                  </Grid>                
              </Grid>
            </div>
            : <Typography style={{textAlign: "center", fontSize: "16px"}}> {(this.state.value).toUpperCase()}, is invalid or cannot be found! </Typography>
          }
      </Box>
      </Modal>
      </>
    );
  }
}
export default withRouter(Searchbar);