import React, { useState } from "react";
import { Typography } from "@mui/material";
import QrReader from "react-qr-scanner";
import { getInvoiceDetials } from "../../services/products/InvoiceApi";

const NewOrder = () => {
  const [result, setResult] = useState("");
  const [InvoiceData, setInvoiceData] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const delay = 100;

  const handleScan = async (data) => {
    if (data) {
      setResult(data.text);

      console.log(data);
      try {
        const response = await fetch(data.text);
        if (response.status !== 200) {
          console.log("Failed to fetch data");
        }

        const responseData = await response.json();

        console.log("API response:", responseData);
        console.log("product data:", responseData.sale);

        // Execute the function to fetch invoice data
        await fetchInvoiceData();
      } catch (error) {
        console.log("Error calling API:", error.message);
      }
    } else {
      // Handle the case when data is not found
      // console.log("Data not found");
    }
  };

  const handleError = (err) => {
    console.log(err);
  };

  const webcamStyle = {
    width: "200px",
    height: "200px",
    objectFit: "cover",
  };

  // Function to fetch data from the server
const fetchInvoiceData = async () => {
  try {
    const resp = await getInvoiceDetials();
    console.log("API Response:", resp);

    if (resp.status === 200) {
      console.log("Response Data:", resp.data);
      setInvoiceData(resp.data.invoiceItems);
      setTotalAmount(resp.data.totalAmount);
    } else {
      console.log("Failed to fetch invoice data.");
    }
  } catch (error) {
    console.error("Error calling API:", error.message);
  }
};
console.log(InvoiceData,"iiiiiiiii");
  return (
    <div style={{ padding: "0 10px" }}>
      <Typography>QR Code scanner</Typography>
      <div>
        <QrReader
          delay={delay}
          style={webcamStyle}
          onError={handleError}
          onScan={handleScan}
        />
        {/* <p>{result}</p> */}
      </div>
    </div>
  );
};

export default NewOrder;
