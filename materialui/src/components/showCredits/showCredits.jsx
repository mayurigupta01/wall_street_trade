import * as React from 'react';
import "./showCredits.css"
import axios from 'axios';
import { Component } from 'react';

class ShowCredits extends Component {
  state = {
    creditsData: [],
    selectedValue : "",
  }

  componentDidMount() {
    axios.get('/show_credits').then(response => {
      console.log(response.data);
      this.setState({creditsData: response.data})
    })
    let param = {
      user_id: JSON.parse(localStorage.getItem('isLoggedIn')).uid,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param)
    };
    fetch("/get_user_credits", requestOptions).then((response) => {
      response.json().then(res=>{
          this.setState({ apidata: res?res:[] });
          console.log("res",res);
      })
    });
    
  }
    
  render() {
    const Dropdown = ({ label, value, options, onChange }) => {
      return (
        <label>
          {label}
          <select value={value} onChange={onChange}>
            {options.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </label>
      );
    };

    console.log(this.state.creditsData);
    console.log(this.state.apidata);
    const credits = [...this.state.creditsData];
  //   var creditsList = Object.keys(credits).map((k) => {
	// 	return (
	// 		<option key={k} value={k}>{credits[k]}</option>  
	// 	)
	// }, this);

  const add = () => {
    let param = {
      user_id: JSON.parse(localStorage.getItem('isLoggedIn')).uid,
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
          console.log(res);
      })
    });
    alert("Credits added successfully!");
  }

  const update = () => {
    let param = {
      user_id: JSON.parse(localStorage.getItem('isLoggedIn')).uid,
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
          console.log(res);
      })
    });
    alert("Credits updated successfully!");
  }    

  const handleCreditChange = (event) => { 
    this.setState({ selectedValue: event.target.value });
  };

	return (
		<div className="showCreditsBlock">
      <Dropdown
        label="Select credits to be added"
        options={credits}
        value={this.state.selectedValue}
        onChange={handleCreditChange}
      />
			{/* <select value={value} onChange={handleChange}>
				{creditsList}
			</select> */}
      {/* {this.state.apidata["Available_balance"] == 0 ?
      <button onClick={add}>Add</button>
      :<button onClick={update}>Update</button>
      } */}
		</div>
    
	);   
}
}

export default ShowCredits;