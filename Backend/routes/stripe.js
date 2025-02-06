import express from "express";
import Stripe from "stripe";
import { db } from "../connect.js";
import axios from "axios";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_KEY);
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.post("/payment", async (req, res) => {
  const {
    tokenId,
    amount,
    customerName,
    shippingCountry,
    shippingAddress,
    shippingCity,
    shippingZip,
    products,
  } = req.body;

  try {
    // Create the charge with Stripe
    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe requires amount in cents
      currency: "usd",
      description: "Shopping Cart Payment",
      source: tokenId,
      shipping: {
        name: customerName,
        address: {
          country: shippingCountry,
          line1: shippingAddress,
          city: shippingCity,
          postal_code: shippingZip,
        },
      },
    });

    const shipping_location = {
      city: shippingCity,
      address: shippingAddress,
      country: shippingCountry,
    };

    console.log("Shipping Location Passed to getNearestLocation:", shipping_location);

    // Use Promise.all to handle all the asynchronous operations in parallel
    const orderPromises = products.map(async (product) => {
      try {
        // Insert order into the database
        const q = `INSERT INTO orders (customer_id, product_id, quantity, total_price, shipping_address) 
          VALUES (?, ?, ?, ?, ?)`;

        const values = [
          2,
          product.id,
          product.quantity,
          product.quantity * product.price,
          JSON.stringify(shipping_location),
        ];

        const [data] = await db.promise().query(q, values);

        // Get the inserted row ID
        const insertedOrderId = data.insertId;

        // Query the stocks for the product
        const q1 = `SELECT stocks.id, stocks.farmer_id, stocks.amount, stocks.location FROM stocks WHERE stocks.product_id = ?`;

        const [stockData] = await db.promise().query(q1, [product.id]);

        console.log("Stock data:", stockData); // Log the result of the query

        if (!stockData || stockData.length === 0) {
          return res
            .status(404)
            .json({
              success: false,
              message: "No stock data found for this product.",
            });
        }

        let remainingQuantity = product.quantity;

        while (remainingQuantity > 0 && stockData.length > 0) {
          // Get stock locations for Google API
          const locations = stockData.map((stock) => {
            return `${stock.location.address}, ${stock.location.city}, ${stock.location.country}`;
          });

          // Find the nearest stock location
          const { idx, nearestLocation } = await getNearestLocation(
            shipping_location,
            locations
          );
          const nearestStock = stockData[idx];
          console.log("idx: ", nearestStock);
          

          if (!nearestStock) {
            console.error("No valid stock data found, breaking loop.");
            break;
          }

          console.log(`Processing stock at location: ${nearestLocation}`);

          if (remainingQuantity >= nearestStock.amount) {
            // Deduct all stock from the nearest location
            const q2 = `INSERT INTO earnings (order_id, product_id, farmer_id, contribution, earning) 
                VALUES (?, ?, ?, ?, ?)`;
            const val2 = [
              insertedOrderId,
              product.id,
              nearestStock.farmer_id,
              nearestStock.amount,
              nearestStock.amount * product.price,
            ];

            await db.promise().query(q2, val2);

            remainingQuantity -= nearestStock.amount;

            // Delete the stock entry from the database
            const q3 = `DELETE FROM stocks WHERE stocks.id = ?`;
            await db.promise().query(q3, [nearestStock.id]);

            // Remove the processed stock from the array
            stockData.splice(idx, 1);
          } else {
            // Partially deduct stock from the nearest location
            const q2 = `INSERT INTO earnings (order_id, product_id, farmer_id, contribution, earning) 
                VALUES (?, ?, ?, ?, ?)`;
            const val2 = [
              insertedOrderId,
              product.id,
              nearestStock.farmer_id,
              remainingQuantity,
              remainingQuantity * product.price,
            ];

            await db.promise().query(q2, val2);

            // Update the stock amount in the database
            const q3 = `UPDATE stocks SET stocks.amount = ? WHERE stocks.id = ?`;
            await db
              .promise()
              .query(q3, [
                nearestStock.amount - remainingQuantity,
                nearestStock.id,
              ]);

            remainingQuantity = 0; // Order is fully satisfied
          }
        }

        if (remainingQuantity > 0) {
          console.error(
            `Order could not be fully satisfied. Remaining quantity: ${remainingQuantity}`
          );
        }
      } catch (err) {
        throw new Error(`Error processing product: ${err.message}`);
      }
    });

    // Wait for all product processing to complete
    await Promise.all(orderPromises);

    // Respond with success after all database operations are complete
    res.status(200).json({ success: true, charge });
  } catch (error) {
    console.error("Error processing payment:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

export default router;

// Function to get the nearest location using Google Distance Matrix API
const getNearestLocation = async (shippingAddress, locations) => {
  const { address, city, country } = shippingAddress;

  const origin = `${address}, ${city}, ${country}`;
  console.log(origin);
  
  const destinations = locations.join("|");
  console.log(destinations);
  console.log(GOOGLE_API_KEY);
  

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destinations)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const distances = response.data.rows[0].elements;

    let nearestLocation = null;
    let minDistance = Infinity;
    let idx = -1; // Default to -1 if no valid index is found

    distances.forEach((distance, index) => {
      if (distance.status === "OK" && distance.distance.value < minDistance) {
        nearestLocation = locations[index];
        minDistance = distance.distance.value;
        idx = index; // Assign the index correctly
        console.log("In Google API function, current index: ", index);      
      }
    });

    if (idx === -1) {
      console.error("No valid location found in Google Distance Matrix API response.");
    }

    console.log("Nearest location index:", idx, "Nearest location:", nearestLocation);

    return { idx, nearestLocation };
  } catch (error) {
    console.error("Error fetching distance data:", error);
    throw new Error("Unable to calculate nearest location");
  }
};
