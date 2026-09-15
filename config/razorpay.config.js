const Razorpay = require("razorpay");

const razorpay =
  process.env.RZP_KEY_ID && process.env.RZP_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RZP_KEY_ID,
        key_secret: process.env.RZP_KEY_SECRET,
      })
    : null;

module.exports = razorpay;
