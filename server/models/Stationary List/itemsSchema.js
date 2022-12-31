const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    initialStock:{
        type:Number
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    itemType:{
        type: String,
        required: true
    }
}, { timestamps: true });

const items = new mongoose.model("items", itemsSchema);

module.exports = items;