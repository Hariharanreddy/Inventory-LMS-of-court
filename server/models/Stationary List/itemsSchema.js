const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    quantityReceived: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },
    dateOfPurchase: {
        type: String,
        required: true
    },
    vendorName: {
        type: String
    },
    requisitionCourtName: {
        type: String
    },
    dateOfRequisitionReceipt: {
        type: String
    },
    dateOfItemIssuance: {
        type: String
    },
    lastRemaining: {
        type: Number
    }
}, { timestamps: true });

const items = new mongoose.model("items", itemsSchema);

module.exports = items;