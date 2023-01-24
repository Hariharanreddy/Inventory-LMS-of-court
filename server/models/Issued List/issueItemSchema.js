const mongoose = require("mongoose");

const issueItemSchema = new mongoose.Schema({
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
    itemId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemType:{
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
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true });

module.exports = mongoose.model("ItemIssue", issueItemSchema);