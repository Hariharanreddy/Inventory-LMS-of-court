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
        type: String,
        default: ""
    },
    dateOfRequisition: {
        type: String,
        default: ""
    },
    dateOfReturn: {
        type: String,
        default: ""
    },
    quantity:{
        type: Number,
        required: true
    },
    publisherName: {
        type: String,
    },
    yearOfPublication: {
        type: Number,
    }
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueBookSchema);