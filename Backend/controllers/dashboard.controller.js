import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getEarningsAndTransaction = (req, res) => {
  const farmer_id = req.params.userId;

  const q = `
         SELECT 
            earnings.id AS earning_id,
            users.first_name, 
            users.last_name, 
            users.email,
            products.name AS product_name, 
            products.crop_type AS product_cropType, 
            products.pic AS product_image, 
            products.price,
            orders.quantity, 
            orders.order_status,
            earnings.earning
        FROM 
            earnings
        INNER JOIN orders ON earnings.order_id = orders.id
        INNER JOIN products ON earnings.product_id = products.id
        INNER JOIN users ON orders.customer_id = users.id
        WHERE 
            earnings.farmer_id = ?
        ;`;

  db.query(q, [farmer_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getProductProgress = (req, res) => {
  const farmer_id = req.params.userId;

  const q = `
          SELECT 
            products.crop_type,
            DATE_FORMAT(earnings.created_at, '%Y-%m') AS yearMonth,
            COUNT(earnings.id) AS earnings_count,
            SUM(earnings.contribution) AS total_contribution,
            SUM(earnings.earning) AS total_earning
          FROM 
            earnings
          INNER JOIN 
            products ON earnings.product_id = products.id
          WHERE 
            earnings.farmer_id = ?
          GROUP BY 
            products.crop_type, yearMonth
          ORDER BY 
            yearMonth ASC, products.crop_type ASC;
  `;

  db.query(q, [farmer_id], (err, data) => {
    if (err) return res.status(500).json(err);

    // Initialize an empty array to store the grouped data
    const groupedData = [];

    // Iterate over the input data to group by yearMonth
    data.forEach((item) => {
      // Find the existing yearMonth object in the groupedData array
      let monthData = groupedData.find(
        (gData) => gData.yearMonth === item.yearMonth
      );

      // If the yearMonth doesn't exist in the array, create a new entry
      if (!monthData) {
        monthData = { yearMonth: item.yearMonth, data: [] };
        groupedData.push(monthData);
      }

      // Add the current item to the data array for the specific yearMonth
      monthData.data.push({
        crop_type: item.crop_type,
        earnings_count: item.earnings_count,
        total_contribution: +item.total_contribution,
        total_earning: +item.total_earning,
      });
    });

    // console.log(JSON.stringify(groupedData, null, 2));

    return res.status(200).json(groupedData);
  });
};

export const getEarningProgress = (req, res) => {
  const farmer_id = req.params.userId;

  const q = `
          SELECT 
            DATE_FORMAT(earnings.created_at, '%Y-%m') AS yearMonth,
            COUNT(earnings.id) AS earnings_count,
            SUM(earnings.contribution) AS total_contribution,
            SUM(earnings.earning) AS total_earning
          FROM 
            earnings
          WHERE 
            earnings.farmer_id = ?
          GROUP BY 
            yearMonth
          ORDER BY 
            yearMonth ASC;
  `;

  db.query(q, [farmer_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getProductStock = (req, res) => {
  // console.log("inside get product stock");

  const farmer_id = req.params.userId;

  const q = `
          SELECT
            stocks.id,
            products.name,
            products.crop_type,
            products.category,
            products.price,
            stocks.amount
          FROM
            stocks
          INNER JOIN products ON stocks.product_id = products.id
          WHERE
            stocks.farmer_id = ?
          `;

  db.query(q, [farmer_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
