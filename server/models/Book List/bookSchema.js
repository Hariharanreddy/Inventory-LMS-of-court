const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
        trim: true
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    stock:{
        type: Number,
    },
    initialStock:{
        type:Number,
    },
    publisherName: {
        type: String,
        trim: true
    },
    yearOfPublication: {
        type: Number,
    },
    price: {
        type: Number,
    },
    purchase: [
        {
            vendorName: {
                type: String,
                required: true
            },
            dateOfPurchase: {
                type: String,
                default: ""
            },
            quantityPurchased:{
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true });

const books = new mongoose.model("books", bookSchema);
module.exports = books;