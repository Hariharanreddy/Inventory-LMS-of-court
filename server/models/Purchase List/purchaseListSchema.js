const mongoose = require("mongoose");

const purchaseListSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
    },
    vendorName: {
        type: String,
        required: true
    },
    dateOfPurchase: {
        type: String,
        default: ""
    },
    quantityPurchased: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("purchaseList", purchaseListSchema);