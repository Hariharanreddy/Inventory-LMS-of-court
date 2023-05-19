const mongoose = require("mongoose");
//current stock of a book should be independent of the request made, that is
//it should be fetched directly from the present database as it is dynamic.

const issueBookSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
    userDepartment: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    },
    bookName: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    dateOfIssue:{
        type: Date,
        default: ""
    },
    dateOfRequisition: {
        type: Date
    },
    dateOfReturn: {
        type: Date,
        default: ""
    },
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true,
        default: 0
    },
    publisherName: {
        type: String,
    },
    yearOfPublication: {
        type: Number,
    }
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueBookSchema);