const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
        unique:true
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
        required: true
    },
    publisherName: {
        type: String,
    },
    yearOfPublication: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    vendorName: {
        type: String,
        required: true
    }, 
    dateOfPurchase: {
        type: String,
        required: true
    }
});

const books = new mongoose.model("books", bookSchema);

module.exports = books;