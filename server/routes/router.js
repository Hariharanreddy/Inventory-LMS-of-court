const express = require("express");
const router = new express.Router();
const books = require("../models/Book List/bookSchema");
const items = require("../models/Stationary List/itemsSchema")
const users = require("../models/User List/userSchema")
const issuedBooks = require("../models/Issued List/issueBookSchema")
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate")

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~User Related API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//User login
router.post("/login", async (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Fields Missing" })
    }

    try {
        const userValid = await users.findOne({ email: email });

        if (userValid) {
            //userValid.password -> is the encrypted password from database
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                return res.status(422).json({ error: "invalid user details" })
            }
            else {
                //token generate
                //from here it goes to userSchema
                const token = await userValid.generateAuthtoken();

                // Cookie Generate
                //usercookie is the cookie name and token is stored inside it
                // res.cookie("usercookie", token, {
                //     expires: new Date((new Date()).getTime() + 9000000),    //it will expire in 9000000 milisec = 150 minutes
                //     httpOnly: false
                // });

                const result = {
                    userValid,
                    token
                }

                return res.status(201).json({ status: 201, result })
            }
        }
        else {
            return res.status(422).json({ error: "invalid user details" })
        }
    }
    catch (error) {
        console.log("Catch Block Error");
        return res.status(401).json(error);
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

    if (!name || !email || !department || !departmentId || !dob || !password || !cpassword) {
        return res.status(422).json({ error: "Fields Missing" });
    }

    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            return res.status(400).json({ error: "Email Already Exists." })
        }
        else if (password !== cpassword) {
            return res.status(422).json({ error: "Password and Confirm Password Did Not Match" })
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
            return res.status(201).json({ status: 201, insertedUser });
        }
    } catch (error) {
        console.log("Server side: catch block error");
        return res.status(422).json(error);
    }
})

//User Valid
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const ValidUserOne = await users.findOne({ _id: req.userId });
        return res.status(201).json({ status: 201, ValidUserOne });
    } catch (error) {
        return res.status(401).json({ status: 401, error });
    }
});

//Logout User
router.get("/logout", authenticate, async (req, res) => {
    try {
        //tokens is an array
        //curelem = current element
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        // res.clearCookie("usercookie", { path: "/" });

        req.rootUser.save();
        res.status(201).json({ status: 201 })
    } catch (error) {
        return res.status(401).json({ status: 401, error })
    }
})

//Get all users 
router.get("/getUsers", async (req, res) => {
    try {
        const allUsers = await users.find();
        console.log(allUsers);
        return res.status(201).json(allUsers)
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//To Return the individual User details
router.get("/getUser/:id", async (req, res) => {
    try {
        //when we want to take out id from the url
        const { id } = req.params;

        const individualUser = await users.findById(id);    //also can be written {_id : id}
        console.log(individualUser);
        return res.status(201).json(individualUser)
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Delete User
router.delete("/deleteUser/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await users.findByIdAndDelete({ _id: id })
        console.log(deletedUser);
        return res.status(201).json(deletedUser);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Book List~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//To Return the Entire Book Database
router.get("/getBooks", async (req, res) => {
    try {
        const bookData = await books.find();
        return res.status(201).json(bookData)
        console.log(bookData);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//To Return the individual book details
router.get("/getBook/:id", async (req, res) => {
    try {
        //when we want to take out id from the url
        const { id } = req.params;

        const individualBook = await books.findById(id);    //also can be written {_id : id}
        console.log(individualBook);
        return res.status(201).json(individualBook)
    }
    catch (err) {
        return res.status(422).json(err);
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

            return res.status(201).json(insertedBook);
            console.log(insertedBook);
        }
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//Update Book data
router.patch("/updateBook/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const updatedBook = await books.findByIdAndUpdate(id, req.body, { new: true });
        console.log(updatedBook);
        return res.status(201).json(updatedBook);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//delete book
router.delete("/deleteBook/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBook = await books.findByIdAndDelete({ _id: id })   //also can be written id
        console.log(deletedBook);
        return res.status(201).json(deletedBook);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Stationary - General Item~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//To Return the Entire Items Database
router.get("/getItems", async (req, res) => {
    try {
        const itemData = await items.find();
        return res.status(201).json(itemData)
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//To Return the individual item details
router.get("/getItem/:id", async (req, res) => {
    try {
        // console.log(req.params);
        const { id } = req.params;

        const individualItem = await items.findById(id);        //also can be written {_id : id}
        console.log(individualItem);
        return res.status(201).json(individualItem)
    }
    catch (err) {
        return res.status(422).json(err);
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
            console.log("Server side : Item is already present.")
            return res.status(422).json("This item is already present!");
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

            return res.status(201).json(insertedItem);
            console.log(insertedItem);
        }
    }
    catch (error) {
        return res.status(422).json(error);
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
        return res.status(201).json(updatedItem);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Delete Item 
router.delete("/deleteItem/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deletedItem = await items.findByIdAndDelete({ _id: id })

        console.log(deletedItem);
        return res.status(201).json(deletedItem);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Issued Book~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Register New Issue of Book
router.post("/bookIssueRequest", async (req, res) => {
    
    const {
        userId,
        userName,
        userDepartment,
        bookId,
        bookName,
        authorName,
        publisherName,
        yearOfPublication } = req.body;

    try {
        const new_issue = await issuedBooks.create({
            userId,
            userName,
            userDepartment,
            bookId,
            bookName,
            authorName,
            publisherName,
            yearOfPublication
        });

        console.log(new_issue);
        return res.status(201).json(new_issue);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//Show all Issued Books Request
router.get("/showIssuedBooksRequest", async (req, res) => {
    try {
        const data = await issuedBooks.find();
        return res.status(201).json(data)
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//Accept Book Issue Request
router.patch("/acceptBookIssueRequest/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const issue = await issuedBooks.findOne({ _id: id })

        if (issue) {
            const book = await books.findOne({ _id: issue.bookId })

            if (book) {
                book.stock -= 1;
                await book.save();

                issue.isIssued = true;
                await issue.save();
        
                // console.log({ issue, book });
                return res.status(201).json(issue);
            }
        }
        else {
            return res.status(422).json("Issue Not Found");
        }
    }
    catch (err) {
        console.log("Catch Block Error");
        return res.status(422).json("Catch Block Error");
    }
})

//Delete Issued Book Request
router.delete("/deleteBookIssueRequest/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deletedRequest = await issuedBooks.findByIdAndDelete({ _id: id })

        console.log(deletedRequest);
        return res.status(201).json(deletedRequest);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

module.exports = router;