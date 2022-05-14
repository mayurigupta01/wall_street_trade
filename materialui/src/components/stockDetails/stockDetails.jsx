import * as React from 'react';
import "./stockDetails.css"
import axios from 'axios';
import { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


class StockDetails extends Component {


  user_data = JSON.parse(localStorage.getItem("isLoggedIn"));
  user_id = this.user_data.user_id;
  state = {
    stocksData : []
  }

  componentDidMount() {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
    fetch(`/get_all_bought_stocks/` + this.user_id, { requestOptions }).then(
        (response) => {
            console.log("Stock portfolio:", response);
          response.json().then((res) => {
            this.setState({ stocksData: res?res:[] });
          });
        }
      );
   }
    
  render() {
    console.log(this.state.stocksData.length);
    let items = [...this.state.stocksData];
    if (this.state.stocksData.length > 0) {
        return (
        <div style={{ height: 450, width: '70%', padding: 20 }}>
            <span className="featuredTitle">Portfolio</span>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 130 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Symbol</TableCell>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Cost Basis</TableCell>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Quantity</TableCell>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Purchase Date</TableCell>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Sell Date</TableCell>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Sell Price</TableCell>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Total Gain</TableCell>
                    <TableCell style={{fontWeight: 'bold', fontSize: '18px'}}>Total Loss</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {items.map((item) => (
                    <TableRow
                    key={item._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row" style={{fontSize: '12px'}}>
                        {item.symbol}
                    </TableCell>
                    <TableCell style={{fontSize: '12px'}}>
                        ${item.costBasis}
                    </TableCell>
                    <TableCell style={{fontSize: '12px'}}>
                        {item.quantity}
                    </TableCell>
                    <TableCell style={{fontSize: '12px'}}>
                        {item.purchaseDate}
                    </TableCell>
                    <TableCell style={{fontSize: '12px'}}>
                        {item.sellDate}
                    </TableCell>
                    <TableCell style={{fontSize: '12px'}}>
                        {item.sellPrice == null? "":"$"+item.sellPrice}
                    </TableCell>
                    <TableCell style={{fontSize: '12px'}}>
                        {item.totalGain == null? "":"$"+item.totalGain}
                    </TableCell>
                    <TableCell style={{fontSize: '12px'}}>
                        {item.totalLoss == null? "":"$"+item.totalLoss}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
        );
    } else {
        return <div>No Stocks Data!</div>;
    }
    }
}

export default StockDetails;