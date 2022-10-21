const express = require("express");
const router = new express.Router();
const books = require("../models/Book List/bookSchema");
const items = require("../models/Stationary List/itemsSchema")
const users = require("../models/User List/userSchema")
const bcrypt = require("bcryptjs");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~User ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//User login
router.post("/login", async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {
        const userValid = await users.findOne({ email: email });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(422).json({ error: "invalid user details" })
            }
            else {
                //token generate
                const token = await userValid.generateAuthtoken();

                // cookiegenerate
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({ status: 201, result })
            }
        }
    }
    catch (error) {
        res.status(401).json(error);
        console.log("catch block error");
    }
})


//To Register A New User
router.post("/registerUser", async (req, res) => {

    const {
        name,
        email,
        department,
        departmentId,
        dob,
        password,
        cpassword } = req.body;

    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "Email Already Exists." })
        }
        else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password Did Not Match" })
        }
        else {
            const finalUser = new users({
                name,
                email,
                department,
                departmentId,
                dob,
                password,
                cpassword
            });

            // Here Password Hashing
            const insertedUser = await finalUser.save();
            res.status(201).json({ status: 201, insertedUser });

        }
    } catch (error) {
        res.status(422).json(error);
        console.log("Server side: catch block error");
    }
})





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
        //when we want to take out id from the url
        const { id } = req.params;

        const individualBook = await books.findById(id);    //also can be written {_id : id}
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

        if (book) {
            res.status(422).json("This book is already present!");
            console.log("Book is already present.")
        }
        else {
            const insertedBook = await books.create({
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

        const updatedBook = await books.findByIdAndUpdate(id, req.body, { new: true });
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
        const { id } = req.params;

        const deletedBook = await books.findByIdAndDelete({ _id: id })   //also can be written id
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

        const individualItem = await items.findById(id);        //also can be written {_id : id}
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
            const insertedItem = await items.create({
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