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
    vendorName: {
        type: String,
        trim: true
    }, 
    dateOfPurchase: {
        type: String,
        required: true
    }
}, { timestamps: true });

const books = new mongoose.model("books", bookSchema);

module.exports = books;