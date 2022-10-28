const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true
    },
    stock:{
        type: Number,
    },
    publisherName: {
        type: String,
    },
    yearOfPublication: {
        type: Number,
    },
    price: {
        type: Number,
    },
    vendorName: {
        type: String,
    }, 
    dateOfPurchase: {
        type: String,
        required: true
    }
}, { timestamps: true });

const books = new mongoose.model("books", bookSchema);

module.exports = books;