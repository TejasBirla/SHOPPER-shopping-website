import express from "express";
import upload from "../config/multerConfig.js";

const uploadRoute = express.Router();

uploadRoute.post("/", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `${process.env.BASE_URL}/images/${req.file.filename}`,
  });
});

export default uploadRoute;
