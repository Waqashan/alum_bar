import React from "react";
import {
  Grid,
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  Typography,
  Button,
} from "@mui/material";
import { useEffect } from "react";
const InvoiceComponent = (props) => {
  const Items = props.InvoiceData;
  const Total = props.totalAmount;
  console.log(props.InvoiceData, "invoice coponent");

  console.log(Total, "invoice total");
  // Dummy array with product information
  const products = [
    { name: "Product 1", quantity: 2, price: 10 },
    { name: "Product 2", quantity: 3, price: 15 },
  ];

  // Calculate total
  const total = products.reduce((acc, product) => {
    return acc + product.quantity * product.price;
  }, 0);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <Box>
      <Grid container sx={{ borderBottom: "0.5px solid gray" }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontSize: "16px" }}>
            Dasby Pofile System
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <address style={{ fontSize: "12px" }}>
            Address: Royal Road St Paul
            <br />Phoenix Mauritius
            <br />Phone: +230 6062720
          </address>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Invoice</Typography>
        <Button
          sx={{ textTransform: "capitalize" }}
          onClick={handlePrintInvoice}
        >
          Print
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontSize:"10px",padding: "5px"}}>Product Name</TableCell>
            <TableCell sx={{fontSize:"10px",padding: "5px"}}>Quantity</TableCell>
            <TableCell sx={{fontSize:"10px",padding: "5px"}}>Price</TableCell>
            <TableCell sx={{fontSize:"10px",padding: "5px"}}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Items ? (
            Items.map((product, index) => (
              <TableRow key={index} sx={{padding:"2px"}}>
                <TableCell sx={{fontSize:"10px",padding: "5px"}}>{product.name}</TableCell>
                <TableCell sx={{fontSize:"10px",padding: "5px"}}>{product.quantity}</TableCell>
                <TableCell sx={{fontSize:"10px",padding: "5px"}}>${product.price}</TableCell>
                <TableCell sx={{fontSize:"10px",padding: "5px"}}>${product.subtotal}</TableCell>
              </TableRow>
            ))
          ) : (
            <p>Data not found</p>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} sx={{ color: "black", fontWeight: "bold", fontSize:"10px",padding: "5px"}}>
              <Typography variant="h6"sx={{fontSize:"15px"}}>Total:</Typography>
            </TableCell>
            <TableCell sx={{ color: "black", fontWeight: "bold",fontSize:"10px",padding: "5px" }}>
              <Typography variant="h6"sx={{fontSize:"15px"}}>${Total}</Typography>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Box>
  );
};

export default InvoiceComponent;
