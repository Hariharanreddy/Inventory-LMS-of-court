const express = require("express");
const router = express.Router();
const books = require("../models/Book List/bookSchema");
const items = require("../models/Stationary List/itemsSchema")


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Book List~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//To Return the Entire Book Database
router.get("/getBooks", async (req, res) => {
    try {
        const bookData = await books.find();
        res.status(201).json(bookData)
        console.log(bookData);
    }
    catch (error) {
        res.status(422).json(error);
    }
})

//To Return the individual book details
router.get("/getBook/:id", async (req, res) => {
    try {
        // console.log(req.params);
        const { id } = req.params;

        const individualBook = await books.findById({ _id: id });
        console.log(individualBook);
        res.status(201).json(individualBook)
    }
    catch (err) {
        res.status(422).json(err);
    }
})


//Register New Book
router.post("/registerBook", async (req, res) => {
    // console.log(req.body);
    const {
        bookName,
        category,
        authorName,
        stock,
        publisherName,
        yearOfPublication,
        price,
        vendorName,
        dateOfPurchase } = req.body;

    try {
        const book = await books.findOne({ bookName: bookName });     // it can also be written just bookName  //object destructuring
        // console.log(book);

        if (book) {
            res.status(422).json("This book is already present!");
            console.log("Book is already present.")
        }
        else {
            let newBook = new books({
                bookName,
                category,
                authorName,
                stock,
                publisherName,
                yearOfPublication,
                price,
                vendorName,
                dateOfPurchase
            });

            const insertedBook = await newBook.save();
            res.status(201).json(insertedBook);
            console.log(insertedBook);
        }
    }
    catch (error) {
        res.status(422).json(error);
    }
})

//Update Book data
router.patch("/updateBook/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const updatedBook = await books.findByIdAndUpdate(id, req.body, {
            new: true
        });

        console.log(updatedBook);
        res.status(201).json(updatedBook);
    }
    catch (err) {
        res.status(422).json(err);
    }
})

//delete book
router.delete("/deleteBook/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deletedBook = await books.findByIdAndDelete({ _id: id })

        console.log(deletedBook);
        res.status(201).json(deletedBook);
    }
    catch (err) {
        res.status(422).json(err);
    }
})


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Stationary - General Item~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//To Return the Entire Items Database
router.get("/getItems", async (req, res) => {
    try {
        const itemData = await items.find();
        res.status(201).json(itemData)
        console.log(itemData);
    }
    catch (error) {
        res.status(422).json(error);
    }
})

//To Return the individual item details
router.get("/getItem/:id", async (req, res) => {
    try {
        // console.log(req.params);
        const { id } = req.params;

        const individualItem = await items.findById({ _id: id });
        console.log(individualItem);
        res.status(201).json(individualItem)
    }
    catch (err) {
        res.status(422).json(err);
    }
})

//Register New Item
router.post("/registerItem", async (req, res) => {
    // console.log(req.body);
    const {
        itemName,
        quantityReceived,
        stock,
        dateOfPurchase,
        vendorName,
        requisitionCourtName,
        dateOfRequisitionReceipt,
        dateOfItemIssuance,
        lastRemaining } = req.body;

    try {
        const item = await items.findOne({ itemName: itemName });     // it can also be written just bookName  //object destructuring
        console.log(item);

        if (item) {
            res.status(422).json("This item is already present!");
            console.log("Server side : Item is already present.")
        }
        else {
            let newItem = new items({
                itemName,
                quantityReceived,
                stock,
                dateOfPurchase,
                vendorName,
                requisitionCourtName,
                dateOfRequisitionReceipt,
                dateOfItemIssuance,
                lastRemaining
            });

            const insertedItem = await newItem.save();
            res.status(201).json(insertedItem);
            console.log(insertedItem);
        }
    }
    catch (error) {
        res.status(422).json(error);
    }
})

//Update Item Data
router.patch("/updateItem/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const updatedItem = await items.findByIdAndUpdate(id, req.body, {
            new: true
        }); 

        console.log(updatedItem);
        res.status(201).json(updatedItem);
    }
    catch (err) {
        res.status(422).json(err);
    }
})

//Delete Item 
router.delete("/deleteItem/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deletedItem = await items.findByIdAndDelete({ _id: id })

        console.log(deletedItem);
        res.status(201).json(deletedItem);
    }
    catch (err) {
        res.status(422).json(err);
    }
})

module.exports = router;