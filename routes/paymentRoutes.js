// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const paymentRoutes = require("./routes/paymentRoutes");
// const productRoutes = require("./routes/productRoutes");
// const authRoutes = require("./routes/authRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.get("/", (req, res) => {
//     res.send("API Working 🚀");
// });

// app.use("/api/payment", paymentRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/auth", authRoutes);

// // MongoDB connection
// mongoose.connect("mongodb+srv://admin:admin123@cluster.f82ndjn.mongodb.net/plantarium?appName=Cluster")
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.log(err));

// // Start server (ONLY ONCE)
// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });





const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");

const router = express.Router();

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 CREATE ORDER
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.json(order);
    } catch (error) {
        console.log("Create Order Error:", error);
        res.status(500).json({ error: "Order creation failed" });
    }
});

// 🔹 VERIFY PAYMENT
router.post("/verify-payment", async (req, res) => {
    try {
        console.log("--- Full Request Body ---", req.body);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        // Trimming inputs
        const orderId = razorpay_order_id?.trim();
        const paymentId = razorpay_payment_id?.trim();
        const signature = razorpay_signature?.trim();
        const secret = process.env.RAZORPAY_KEY_SECRET?.trim();

        console.log("--- Signature Verification Data ---", { orderId, paymentId, hasSignature: !!signature });

        if (!orderId || !paymentId || !signature) {
            console.log("Missing Data ❌", { orderId, paymentId, signature });
            return res.status(400).json({
                success: false,
                error: "Missing verification data",
                received: { orderId, paymentId, hasSignature: !!signature }
            });
        }

        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        console.log("--- Signature Verification ---");
        console.log("Body:", body);
        console.log("Received Signature:", signature);
        console.log("Expected Signature:", expectedSignature);

        if (expectedSignature === signature) {
            console.log("Status: Signature Matched ✅");
            await Payment.create({
                orderId: orderId,
                paymentId: paymentId,
                signature: signature,
                amount,
                status: "Success",
            });

            res.json({ success: true });
        } else {
            console.log("Status: Signature Mismatch ❌");
            res.status(400).json({
                success: false,
                error: "Signature Mismatch",
                details: {
                    received: signature?.substring(0, 10) + "...",
                    expected: expectedSignature?.substring(0, 10) + "..."
                }
            });
        }
    } catch (error) {
        console.log("Verify Error:", error);
        res.status(500).json({ error: "Verification failed" });
    }
});

module.exports = router;