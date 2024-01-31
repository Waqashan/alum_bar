const productSchema = require("../model/productSchema");
const saleModel = require("../model/SalesSchema");
const QRCode = require("qrcode");
const mongoose = require("mongoose"); // Import Mongoose

exports.AddProduct = async (req, res) => {
  const { productName, productDescription, quantity, productcode, price } =
    req.body;
  const image = req.file ? req.file.path : null;

  try {
    if (
      !productName ||
      !productDescription ||
      !quantity ||
      !productcode ||
      !price
    ) {
      return res.status(400).json({ message: "Fill all input fields" });
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product_data = new productSchema({
      productName,
      productDescription,
      quantity,
      productcode,
      image: image,
      price,
    });

    const result = await product_data.save();
    res.status(200).json({ message: "Product added successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all products

exports.getAllproduct = async (req, res) => {
  try {
    let { page, size } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    const skip = (page - 1) * size;
    const totalProducts = await productSchema.countDocuments();

    const totalPages = Math.ceil(totalProducts / size);

    let getdata = await productSchema.find().skip(skip).limit(size);
    if (!getdata) {
      return res.status(400).json({ message: "data not found" });
    }

    res
      .status(200)
      .json({
        message: "get all products successfully",
        getdata,
        currentPage: page,
        totalPages,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.finOneProduct = async (req, res) => {
  let id = req.params.id;

  console.log(id, "data..............");
  try {
    let data = await productSchema.findById(id);
    res.status(200).json({ message: " products found successfully", data });
  } catch (error) {
    res.status(404).json({ message: "product not found" });
  }
};

// get updat products

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { productName, productDescription, quantity, productcode, price } =
    req.body;
  const image = req.file ? req.file.path : req.body.image;

  try {
    if (
      !productName ||
      !productDescription ||
      !quantity ||
      !productcode ||
      !price
    ) {
      return res.status(400).json({ message: "fill all input fields" });
    }

    const updadteproduct = await productSchema.findByIdAndUpdate(
      id,
      { productName, productDescription, quantity, productcode, price, image },
      { new: true }
    );
    console.log(updadteproduct);

    if (!updadteproduct) {
      return res.status(400).json({ message: "user not updated" });
    }

    res
      .status(200)
      .json({ message: "product updated succesfully", updadteproduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// get delete products

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ message: "please provide id !!" });
    }
    let doc = await productSchema.findByIdAndDelete(id);
    if (!doc) {
      return res
        .status(400)
        .json({ message: "product not deleted any problem an id!!" });
    }
    res.status(200).json({ message: "Product  deleted successfully", doc });

    //let fun=(id,(err,doc)=>{
    //     if(err){
    //
    //     }

    //     res.status(200).json({message:"Product  deleted successfully",doc})
    //  });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getQrcode = async (req, res) => {
  const id = req.params.id;

  try {
    const productUrl = `http://51.20.193.213:3000/api/decrement/${id}`;

    //now  Generating the QR code for the URL
    QRCode.toDataURL(productUrl, (err, url) => {
      if (err) {
        return res.status(500).json({ error: "failed to generate QR code" });
      }

      res.status(200).json({ qrCodeUrl: url });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to process the request" });
  }
};

// exports.DecrementQuantity = async (req, res) => {

//   try {

//     const id = req.params.id;

//     const product = await productSchema.findById(id);

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     product.quantity -= 1;
//     await product.save();

//     res.status(200).json({ message: 'Product quantity Decremented successfully', productQuantity: product.quantity });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to decremented the product quantity' });
//   }
// }



exports.IncrementQuantity = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.quantity += 1;
    await product.save();

    res
      .status(200)
      .json({
        message: "Product quantity Incremented successfully",
        productQuantity: product.quantity,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to decrement the product quantity" });
  }
};

// update quantity of the product

exports.updateQuantity = async (req, res) => {
  const id = req.params.id;
  try {
    let { newQuantity } = req.body;

    newQuantity = parseInt(newQuantity);

    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.quantity += newQuantity;
    await product.save();

    res
      .status(200)
      .json({ message: "Product quantity updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the product quantity" });
  }
};

exports.TotalProducts = async (req, res) => {
  try {
    const totalProducts = await productSchema.countDocuments();
    res.status(200).json({ message: "total products", totalProducts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get the total number of products" });
  }
};
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProductsCount = await productSchema.countDocuments({
      quantity: { $lt: 10 },
    });
    const lowStockProducts = await productSchema.find({
      quantity: { $lt: 10 },
    });

    if (!lowStockProducts || lowStockProducts.length === 0) {
      return res.status(404).json({ message: "No low stock products found" });
    }

    res.status(200).json({
      message: "Low stock products retrieved successfully",
      lowStockProductsCount,
      lowStockProducts,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve low stock products data" });
  }
};
exports.getMostStockProducts = async (req, res) => {
  try {
    const mostStockProductsCount = await productSchema.countDocuments({
      quantity: { $gt: 10 },
    });
    const mostStockProducts = await productSchema.find({
      quantity: { $gt: 10 },
    });

    res.status(200).json({
      message: "Most stock products retrieved successfully",
      mostStockProductsCount,
      mostStockProducts,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve most stock products data" });
  }
};


exports.getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await saleModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const monthlySales = await saleModel.aggregate([
      {
        $group: {
          _id: { $month: "$saleDate" },
          total: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          month: "$_id",
          total: 1,
          _id: 0,
        },
      },
    ]);

    const currentMonth = new Date().getMonth() + 1;  // Adding 1 because months are zero-indexed

    const currentMonthSales = monthlySales.find((month) => month.month === currentMonth) || { month: currentMonth, total: 0 };

    const formattedMonthlySales = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlySales.find((month) => month.month === i + 1) || { month: i + 1, total: 0 };
      return monthData;
    });

    res.status(200).json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      monthlySales: formattedMonthlySales,
      currentMonthSales,
    });
  } catch (error) {

    console.error(error);


    res.status(500).json({ error: "Failed to retrieve total revenue and monthly sales" });
  }
}










exports.getTopRatedProducts = async (req, res) => {
  try {
    const topRatedProducts = await productSchema
      .find()
      .sort({ quantity: -1 })
      .limit(5);

    if (!topRatedProducts || topRatedProducts.length === 0) {
      return res.status(404).json({ message: "No top-rated products found" });
    }

    console.log(topRatedProducts);
    res
      .status(200)
      .json({
        message: "Top-rated products retrieved successfully",
        topRatedProducts,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve top-rated products data" });
  }
};







// sale api
const scannedQRCodes = [];  

exports.DecrementQuantity = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
console.log(product);
    // Assuming you have a price property in your product schema
    const price = product.price;


    // Decrement quantity
    product.quantity -= 1;
    await product.save();

    // Create a sale record
    const sale = new saleModel({
      product: product._id,
      quantity: 1, // Assuming you decrement by 1 for each sale
      totalPrice: price,
    });
    const result=await sale.save();
    console.log(result);

    scannedQRCodes.push({ productId: product._id, price, quantity: 1,product });
    console.log( scannedQRCodes,"scan qr code or sale item array");
    res
      .status(200)
      .json({
        message: "Product quantity decremented and sale recorded successfully",
        productQuantity: product.quantity,
        sale,
        scannedQRCodes,
        
      });
  } catch (error) {
    console.error(error);

    res
    
      .status(500)
      .json({
        message: "Failed to decrement the product quantity and record sale",
      });
  }
};










// top sales api

exports.TopSalesProduct = async (req, res) => {
  try {
    const topSales = await saleModel.aggregate([
      {
        $group: {
          _id: "$product",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "products", // Replace 'products' with the actual name of your product collection
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      {
        $unwind: "$productDetails",
      },
      {
        $sort: { totalQuantity: -1 }, // You can use -1 for descending order
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({ topSales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve top sales products" });
  }
};
exports.TopSoldProduct = async (req, res) => {
  try {
    const topSales = await saleModel.aggregate([
      {
        $group: {
          _id: "$product",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "products", // Replace 'products' with the actual name of your product collection
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $sort: { totalRevenue: -1 }, // Sort based on totalRevenue in descending order
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({ topSales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve top sales products" });
  }
};



const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
exports.getLastWeekSales = async (req, res) => {

  try {
    const currentDate = new Date();
    const lastWeekStartDate = new Date(currentDate);
    lastWeekStartDate.setDate(currentDate.getDate() - 7);

    const lastWeekSales = await saleModel.aggregate([
      {
        $match: {
          saleDate: { $gte: lastWeekStartDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }, // Count the number of sales for each day
        },
      },
      {
        $sort: {
          "_id.day": 1,
        },
      },
    ]);

    const formattedSales = lastWeekSales.map((daySale) => ({
      day: daySale._id.day,
      total: daySale.total,
      count: daySale.count,
      // Add day name to the response
      dayName: getDayName(daySale._id.day),
    }));

    // Create an array with all the days of the last week
    const allDaysOfLastWeek = getDaysArray(lastWeekStartDate, currentDate);

    // Fill in missing days with default values
    const result = allDaysOfLastWeek.map((day) => {
      const matchingSale = formattedSales.find(
        (sale) => sale.day === day || sale.day.startsWith(day)
      );
      if (matchingSale) {
        return matchingSale;
      } else {
        // If there's no sale for the day, set default count and revenue to 0
        return { day, count: 0, total: 0, dayName: getDayName(day) };
      }
    });

    res.status(200).json({
      lastWeekSales: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve last week's sales" });
  }
};

// Function to get an array of date strings between two dates
function getDaysArray(startDate, endDate) {
  const days = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

// Function to get the day name from a date string
function getDayName(dateString) {
  const date = new Date(dateString);
  return dayNames[date.getDay()];
}

// invoice api

exports.GenerateInvoice = async (req, res) => {
  try {
    // Fetch product details for each item in the invoice
    const invoiceItems = await Promise.all(
      scannedQRCodes.map(async (scannedQRCode) => {
        const { productId, quantity, price } = scannedQRCode;

        const product = await productSchema.findById(productId);

        if (!product) {
          return {
            error: `Product with ID ${productId} not found`,
            scannedQRCode,
          };
        }

        return {

          name:product.productName,
          quantity,
          price,
          subtotal: price * quantity,
         
        };
      })
    );


    // Check for errors in fetching product details
    const errors = invoiceItems.filter((item) => item.error);
    if (errors.length > 0) {
      return res.status(404).json({ errors });
    }

    // Calculate total amount for the invoice
    const totalAmount = invoiceItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    // Create a new sale record for each item in the invoice
    // const saleRecords = await Promise.all(
    //   invoiceItems.map(async (item) => {
    //     const { product, quantity, subtotal } = item;

    //     const sale = new saleModel({
    //       product: product._id,
    //       quantity,
    //       totalPrice: subtotal,
    //     });

    //     await sale.save();

    //     // Update product quantity in the inventory
    //     product.quantity -= quantity;
    //     await product.save();

    //     return sale;
    //   })
    // );

    // Clear the scanned QR codes array after use
    scannedQRCodes.length = 0;

    res.status(200).json({
      message: "Invoice generated successfully",
      invoiceItems,
      totalAmount,
      // saleRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate the invoice" });
  }
};