const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.post("/", async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
});

router.delete("/:id", async (req, res) => {
    const products = await Product.findByIdAndDelete(req.params.id);
    res.json(products);
});

router.put("/:id", async (req, res) => {
    const products = await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json(products);
});



module.exports = router; 