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
// router.get("/getBook/:id", async (req, res) => {
//     try {
//         console.log(req.params);
//         const { id } = req.params;

//         const individualBook = await books.findById({ _id: id });
//         console.log(individualBook);
//         res.status(201).json(individualBook)
//     }
//     catch (err) {
//         res.status(422).json(err);
//     }
// })


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

    if (!bookName || !category || !authorName || !vendorName) {
        res.status(422).json("plz fill the data");
        console.log("Please fill all the Data!");
    }

    try {
        const book = await books.findOne({ bookName: bookName });     // it can also be written just bookName  //object destructuring
        console.log(book);

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

            await newBook.save();
            res.status(201).json(newBook);
            console.log(newBook);
        }
    }
    catch (error) {
        res.status(422).json(error);
    }
})

module.exports = router;