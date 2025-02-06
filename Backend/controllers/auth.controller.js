import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User account already exists");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`first_name`, `last_name`, `email`, `password`, `role`, `profile_picture`) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      hashedPassword,
      req.body.role,
      req.body.profile_picture,
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) return res.status(400).json("wrong email or password");

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15h",
    });

    const { password, ...others } = data[0];

    res.status(200).json({ accessToken: token, info: { ...others } });
  });
};

export const logout = (req, res) => {
  res.status(200).json("User has been logged out");
};
