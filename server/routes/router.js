const express = require("express");
const router = express.Router();
const books = require("../models/bookSchema");

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


//Register book
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

//update Book data
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

module.exports = router;