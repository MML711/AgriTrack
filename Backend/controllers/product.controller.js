import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getProducts = (req, res) => {
  // const q = `SELECT products.* FROM products`;
  const q = `SELECT products.*, CAST(SUM(stocks.amount) AS SIGNED) AS stock_amount FROM products LEFT JOIN stocks ON products.id = stocks.product_id GROUP BY products.id`;

  db.query(q, (err, data) => {
    // console.log("inside get products");
    
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getProductsByCropType = (req, res) => {  
  const paramValue = req.params.cropType.split("-");
  const crop_type = paramValue.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const q = `SELECT products.*, FROM products WHERE products.crop_type = ?`;

  db.query(q, crop_type, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getProductsFormatted = (req, res) => {  
  const q = `SELECT products.* FROM products ORDER BY crop_type, category`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    // Transform data into the desired format
    const formattedData = [];
    const cropTypeMap = {};

    data.forEach((product) => {      
      const cropTypeSlug = product.crop_type.toLowerCase().replace(/\s+/g, '-');
      const cropTypeName = product.crop_type;

      if (!cropTypeMap[cropTypeSlug]) {
        cropTypeMap[cropTypeSlug] = {
          cropType: cropTypeSlug,
          cropName: cropTypeName,
          details: [],
        };
        formattedData.push(cropTypeMap[cropTypeSlug]);
      }

      const cropDetails = cropTypeMap[cropTypeSlug];
      let categoryGroup = cropDetails.details.find((d) => d.category === product.category);

      if (!categoryGroup) {
        categoryGroup = {
          category: product.category,
          data: [],
        };
        cropDetails.details.push(categoryGroup);
      }

      categoryGroup.data.push({
        id: product.id,
        name: product.name,
        title: product.title,
        description: product.description,
        pic: product.pic,
        price: parseFloat(product.price),
      });
    });

    // console.log(JSON.stringify(formattedData, null, 2));

    return res.status(200).json(formattedData);
  });
};

// ----------------------------------------------
export const getFarmerProducts = (req, res) => {
  const userId = req.params.userId;

  const token = req.header.accesstoken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT products.*, stocks.amount, stocks.expiry_date FROM products JOIN stocks ON (stocks.product_id = products.id) WHERE stocks.farmer_id = ? ORDER BY products.created_at DESC`;
    
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
  });
};
