import { db } from "../connect.js";

export const addStock = (req, res) => {
  const { productId, amount, location } = req.body;

  console.log("inside add stocks");
  console.log("productId: ", productId);
  
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const expiryDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const q = `INSERT INTO stocks (farmer_id, product_id, amount, expiry_date, location) VALUES (?, ?, ?, ?, ?)`;

  const values = [1, productId, amount, expiryDate, JSON.stringify(location)];

  db.query(q, values, (err, data) => {
    console.log("inside add stocks db.query");

    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getAllStocks = (req, res) => {
const q = `SELECT * FROM stocks ORDER BY stocks.product_id`;

db.query(q, (err, data) => {
  if (err) return res.status(500).json(err);
  return res.status(200).json(data);
})
}