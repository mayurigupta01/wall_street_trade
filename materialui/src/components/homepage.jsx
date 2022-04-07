import React, { Component } from "react";
import axios from "axios";

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios
      .get("/news")
      .then((res) => {
        console.log(res.data);
        // data: res.data,
        var arr = [];
        for (let [key, val] of Object.entries(res.data)) {
          console.log("key-->", key, val);
          arr.push({ key: val });
        }
        console.log("Arr", arr);
        this.setState({ data: arr });

      })
  }
  render() {
    console.log(this.state.data);
    if (this.state.data.length > 0) {
      return (
        <div>
          <h2> Welcome </h2>
          <ul>
            {this.state.data.map(function (news, index) {
              return (
                <div key={index}>
                  <h2> Welcome </h2>
                  <p>{news.key}</p>
                </div>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return <div>No data</div>;
    }
  }
}

export default Homepage;
