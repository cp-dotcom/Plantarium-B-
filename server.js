// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const paymentRoutes = require("./routes/paymentRoutes");

// const app = express();
// const productRoutes = require("./routes/productRoutes");
// const authRoutes = require("./routes/authRoutes");

// app.use(cors());
// app.use(express.json());

// app.use("/api/payment", paymentRoutes);

// // MongoDB connection
// mongoose.connect("mongodb+srv://admin:admin123@cluster.f82ndjn.mongodb.net/plantarium?appName=Cluster")
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.log(err));

// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });

// // Routes
// app.get("/", (req, res) => {
//     res.send("API Working 🚀");
// });


// app.use("/api/products", productRoutes);
// app.use("/api/auth", authRoutes);

// // Start server (ALWAYS LAST)
// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });





require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("API Working 🚀");
});

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
console.log("MONGO_URI:", process.env.MONGO_URI); // TEMP DEBUG

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error:", err));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});