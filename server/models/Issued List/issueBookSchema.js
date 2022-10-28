const mongoose = require("mongoose");

const issueBookSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
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
    publisherName: {
        type: String,
    },
    yearOfPublication: {
        type: Number,
    },
    isIssued: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueBookSchema);