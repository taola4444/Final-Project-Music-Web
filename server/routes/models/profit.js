const mongoose = require("mongoose");

const profitSchema = mongoose.Schema({
    currency_code: {
        type: String,
    },
    total_balance: {
        type: String,
    },
    date: {
        type: String,
    }
},{timestamps: true});

module.exports = mongoose.model("profit",profitSchema);