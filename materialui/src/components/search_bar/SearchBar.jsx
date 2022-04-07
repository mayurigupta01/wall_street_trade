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

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      apidata: null,
      showModal:false
    };
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
      <SearchBar
        value={this.state.value}
        onChange={(newValue) => this.setState({ value: newValue })}
        onRequestSearch={() => this.handleRequestSearch(this.state.value)}
      />
      <Button variant="outlined"
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
export default Searchbar;