import * as React from 'react';
import "./showCredits.css"
import axios from 'axios';
import { Component } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { ThreeSixtyTwoTone } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: '5px solid #000',
  boxShadow: 24,
  p: 5,
  fontSize: '16px'
};

class ShowCredits extends Component {


user_data = JSON.parse(localStorage.getItem("isLoggedIn"));
user_id = this.user_data.user_id;
  state = {
    creditsData: [],
    availableBalance:0,
    selectedValue : 0,
  }

  componentDidMount() {
    axios.get('/show_credits').then(response => {
      console.log("show credits", response.data);
      this.setState({creditsData: response.data})
    })
    this.getUserCredits();
    
  }

  getUserCredits=()=>{
    console.log("get user--->")
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`/get_user_credits/` + this.user_id, { requestOptions }).then(
      (response) => {
        response.json().then((res) => {
          this.setState({availableBalance:res.Available_balance})
          //this.state.availableBalance = res.Available_balance;
          console.log("api-->data", res.Available_balance);
        });
      }
    );
    
  }

  handleClose=()=>{
    console.log("Inside handle close");
    this.setState({showModal:false});
  }

 handleBuyOpen = () => {
    console.log("Inside handle open");
    this.setState({showModal:true});
  }

  add = () => {
    let param = {
      user_id: this.user_id,
      amount: this.state.selectedValue
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param)
    };
    fetch("/add_user_credits", requestOptions).then((response) => {
      response.json().then(res=>{
          this.setState({ addapidata: res?res:[] });
          console.log("addapidata", res);
      })
    });
    alert("Credits added successfully!");
    this.getUserCredits();
    //document.getElementById('balance').innerHTML = "$"+ this.state.availableBalance;
  }

  update = () => {
    console.log("update--->")
    let param = {
      user_id: this.user_id,
      amount: this.state.selectedValue
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param)
    };
    fetch("/update_user_credits", requestOptions).then((response) => {
      response.json().then(res=>{
          this.setState({ updateapidata: res?res:[] });
          console.log("updateapidata---->" , res);
          this.getUserCredits();
      })
    });
   // alert("Credits updated successfully!");
    
    //document.getElementById('balance').innerHTML = "$"+ this.state.availableBalance;
  }    

  handleCreditChange = (event) => { 
    this.setState({ selectedValue: event.target.value });
  };

  render() {
    const Dropdown = ({ label, value, options, onChange }) => {
      return (
        <label>
          {label}
          <span class ="dropdown">
          <select value={value} onChange={onChange}>
            {options.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
          </span>
        </label>
      );
    };

  
    console.log(this.state.creditsData);
    console.log(this.state.availableBalance);
    this.state.creditsData = this.state.creditsData.sort((a,b)=> a-b);
    const credits = [...this.state.creditsData];
  //   var creditsList = Object.keys(credits).map((k) => {
	// 	return (
	// 		<option key={k} value={k}>{credits[k]}</option>  
	// 	)
	// }, this);

	return (
    <><Button classname="creditsButton" variant="outlined" onClick={this.handleBuyOpen}>Credits</Button>
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
            <div className="showCreditsBlock">
            <div class="divspace">
              <h2><b>AVAILABLE BALANCE: <span id ="balance" style={{color: 'green'}}>${this.state.availableBalance}</span></b></h2>
            </div>

            <div class="divSpace">
            <Dropdown
              label="Select credits to be added"
              options={credits}
              value={this.state.selectedValue}
              onChange={this.handleCreditChange} />
            </div>
            
            {/* <select value={value} onChange={handleChange}>
            {creditsList}
        </select> */}
        <div class ="container divSpace">
            <div class="center">
            { this.state.availableBalance == 0 ?
            <button classname="creditsButton" variant="outlined" onClick={this.add} class="btn btn-primary btn-sx" type="button">Add</button> 
              : <button classname="creditsButton" variant="outlined" onClick={this.update} class="btn btn-primary btn-sx" type="button">Update</button> }
              </div>
          </div>
          </div>

          }
        </Box>
      </Modal></>
		
    
	);   
}
}

export default ShowCredits;