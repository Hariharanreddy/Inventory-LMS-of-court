const express = require("express");
const router = new express.Router();
const books = require("../models/Book List/bookSchema");
const items = require("../models/Stationary List/itemsSchema")
const users = require("../models/User List/userSchema")
const purchaseList = require("../models/Purchase List/purchaseListSchema")
const issuedBooks = require("../models/Issued List/issueBookSchema")
const issuedItems = require("../models/Issued List/issueItemSchema")
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~User Related API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//User login
router.post("/login", async (req, res) => {

    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(422).json({ error: "Fields Missing" })
        }

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

    try {
        const {
            name,
            email,
            department,
            departmentId,
            dob,
            phoneNo,
            password,
            cpassword } = req.body;

        if (!name || !email || !department || !departmentId || !dob || !password || !cpassword || !phoneNo) {
            return res.status(422).json({ error: "Fields Missing" });
        }

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
                phoneNo,
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
        return res.status(201).json({ status: 201 })
    } catch (error) {
        return res.status(401).json({ status: 401, error })
    }
})
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~EMAIL RELATED API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
})

//Send Email Link for reset password
router.post("/sendPasswordLink", async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) {
            res.status(401).json({ status: 401, message: "Enter Your Email" })
        }

        const userfind = await users.findOne({ email: email });

        // token generate for reset password
        const token = jwt.sign({ _id: userfind._id }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });

        const setusertoken = await users.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });

        if (setusertoken) {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Email For Password Reset",
                text: `This Link Will Be Valid For 2 Minutes http://localhost:5173/forgotPassword/${userfind.id}/${setusertoken.verifytoken}/hfus`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(401).json({ status: 401, message: "email not send" })
                } else {
                    console.log("Email sent", info.response);
                    res.status(201).json({ status: 201, message: "Email sent Succsfully" })
                }
            })
        }
    } catch (error) {
        res.status(401).json({ status: 401, message: "invalid user" })
    }
})

//verify user for forgot password time
router.get("/forgotPassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    try {
        const validuser = await users.findOne({ _id: id, verifytoken: token });

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        if (validuser && verifyToken._id) {
            res.status(201).json({ status: 201, validuser })
        } else {
            res.status(401).json({ status: 401, message: "user not exist" })
        }

    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
})

// change password

router.post("/:id/:token", async (req, res) => {

    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const validuser = await users.findOne({ _id: id, verifytoken: token });

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        if (validuser && verifyToken._id) {
            const newpassword = await bcrypt.hash(password, 12);

            const setnewuserpass = await users.findByIdAndUpdate({ _id: id }, { password: newpassword });

            setnewuserpass.save();
            res.status(201).json({ status: 201, setnewuserpass })

        } else {
            res.status(401).json({ status: 401, message: "user not exist" })
        }
    } catch (error) {
        res.status(401).json({ status: 401, error })
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

//To Return the Book Database
router.get("/getBooks", async (req, res) => {
    try {

        const page = parseInt(req.query.page) - 1 || 0;     //array starts from 0 in mongodb so minus 1
        const limit = parseInt(req.query.limit) || 6;
        let sort = req.query.sort || ""
        const search = req.query.search || "";

        // const {bookName} = req.query;
        // const match = {};

        // if(bookName){
        //     match.bookName = {$regex: bookName, $options: "i"};
        // }

        // let category = req.query.genre || "All";

        // const categoryOptions = [
        //     "Lenore Dickerson",
        //     "Sykes Shelton"
        // ];

        // category === "All"
        //     ?(category = [...categoryOptions])
        //     :(genre = req.query.genre.split(","));

        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        const booksData = await books.find({
            "$or": [
                { "bookName": { $regex: search, $options: "i" } },
                { "authorName": { $regex: search, $options: "i" } }
            ]
        })
            .sort(sortBy)
            .skip(page * limit)     //skips no of documents
            .limit(limit);
        // .where("genre")
        // .in([...genre])

        const total = await books.countDocuments({
            $or: [
                { "bookName": { $regex: search, $options: "i" } },
                { "authorName": { $regex: search, $options: "i" } }
            ]
        });

        const response = {
            total,
            page: page + 1,
            limit,
            booksData
            // genres: genreOptions
        }

        return res.status(201).json(response);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//To download the Book Database
router.get("/getBooksToDownload", async (req, res) => {
    try {

        let sort = req.query.sort || ""
        const search = req.query.search || "";

        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        const booksData = await books.find({
            $or: [
                { "bookName": { $regex: search, $options: "i" } },
                { "authorName": { $regex: search, $options: "i" } }
            ]
        })
            .sort(sortBy)

        return res.status(201).json(booksData);
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
        return res.status(201).json(individualBook)
    }
    catch (err) {
        return res.status(422).json(err);
    }
})


//Register New Book
router.post("/registerBook", async (req, res) => {

    try {
        const {
            bookName,
            category,
            authorName,
            initialStock,
            stock,
            publisherName,
            yearOfPublication,
            price
        } = req.body;

        if (!bookName || !category || !authorName) {
            return res.status(422).json({ status: 422, message: "incomplete data" });
        }

        const book = await books.findOne({ bookName: bookName });   // it can also be written just bookName  //object destructuring

        if (book) {
            console.log("Book is already present.")
            return res.status(422).json({ status: 422, message: "Book already present" });
        }
        else {
            const insertedBook = await books.create({
                bookName,
                category,
                authorName,
                stock,
                initialStock,
                publisherName,
                yearOfPublication,
                price
            });

            console.log(insertedBook);
            return res.status(201).json(insertedBook);
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
        return res.status(201).json(deletedBook);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PURCHASE LIST RELATED API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//this works for both book and item 
router.post("/addOn", async (req, res) => {
    try {
        let { itemId, vendorName, dateOfPurchase, quantityPurchased } = req.body;

        if (dateOfPurchase == "") {
            let ts = Date.now();
            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            dateOfPurchase = `${year}-${month}-${date}`;
        }

        const newPurchase = await purchaseList.create({
            itemId,
            vendorName,
            dateOfPurchase,
            quantityPurchased
        });

        //don't worry it won't take much time because it _id is indexed by default
        const book = await books.findOne({ _id: itemId });

        if (book) {
            book.stock += JSON.parse(quantityPurchased);
            await book.save()

            return res.status(201).json(newPurchase);
        }
        else {
            const item = await items.findOne({ _id: itemId });

            if (item) {
                item.stock += JSON.parse(quantityPurchased);
                await item.save()
                return res.status(201).json(newPurchase);
            }
            else {
                return res.status(401).json({ status: 401, message: "Book or Item does not exist" });
            }
        }
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//To return the purchase list in pagination
//this will also work for book as well as item
router.get("/getPurchaseList", async (req, res) => {
    try {

        const id = req.query.id;
        const page = parseInt(req.query.page) - 1 || 0;     //array starts from 0 in mongodb so minus 1
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const listData = await purchaseList.find({
            "$and": [{
                "itemId": id
            },
            {
                "$or": [
                    { "vendorName": { $regex: search, $options: "i" } },
                    { "dateOfPurchase": { $regex: search, $options: "i" } }
                ]
            }
            ]
        })
            .skip(page * limit)     //skips no of documents
            .limit(limit);

        const total = await purchaseList.countDocuments({
            "$and": [{
                "itemId": id
            },
            {
                "$or": [
                    { "vendorName": { $regex: search, $options: "i" } },
                    { "dateOfPurchase": { $regex: search, $options: "i" } }
                ]
            }
            ]
        });

        const response = {
            total,
            page: page + 1,
            limit,
            listData
        }

        return res.status(201).json(response);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//To download the Book or Items Purchase List
router.get("/getPurchaseListToDownload", async (req, res) => {
    try {

        const id = req.query.id;
        const search = req.query.search || "";

        const listData = await purchaseList.find({
            "$and": [{
                "itemId": id
            },
            {
                "$or": [
                    { "vendorName": { $regex: search, $options: "i" } },
                    { "dateOfPurchase": { $regex: search, $options: "i" } }
                ]
            }
            ]
        })

        return res.status(201).json(listData);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Book Issue Related API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Register New Issue of Book
router.post("/bookIssueRequest", async (req, res) => {
    try {
        let { userId, bookId, dateOfRequisition, quantity } = req.body;

        const book = await books.findOne({ _id: bookId });
        const user = await users.findOne({ _id: userId });

        if (book && user) {

            if (dateOfRequisition == "") {
                dateOfRequisition = Date.now()
            }
            else {
                dateOfRequisition = new Date(dateOfRequisition)
            }

            const new_issue = await issuedBooks.create({
                userId: user._id,
                userName: user.name,
                userDepartment: user.department,
                bookId: book._id,
                bookName: book.bookName,
                authorName: book.authorName,
                publisherName: book.publisherName,
                yearOfPublication: book.yearOfPublication,
                dateOfRequisition: dateOfRequisition,
                price: book.price,
                quantity
            });

            return res.status(201).json(new_issue);
        }
        else {
            return res.status(401).json({ status: 401, message: "book or user does not exist" });
        }
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//For Directly Crediting the book to user
router.post("/directAcceptIssueRequest", async (req, res) => {
    try {
        let { userId, bookId, dateOfRequisition, quantity } = req.body;

        const book = await books.findOne({ _id: bookId });
        const user = await users.findOne({ _id: userId });

        if (book && user) {

            if (book.stock != 0 && book.stock >= quantity) {

                if (dateOfRequisition == "") {
                    dateOfRequisition = Date.now()
                }
                else {
                    dateOfRequisition = new Date(dateOfRequisition)
                }

                const new_issue = await issuedBooks.create({
                    userId: user._id,
                    userName: user.name,
                    userDepartment: user.department,
                    bookId: book._id,
                    bookName: book.bookName,
                    authorName: book.authorName,
                    publisherName: book.publisherName,
                    yearOfPublication: book.yearOfPublication,
                    dateOfIssue: Date.now(),
                    dateOfRequisition: dateOfRequisition,
                    price: book.price,
                    quantity,
                });

                book.stock -= JSON.parse(quantity);
                await book.save();
                return res.status(201).json(new_issue);
            }
            else {
                return res.status(400).json({ status: 400, message: "Either stock or quantity is 0 or else quantity asked is greater than stock." });
            }
        }
        else {
            return res.status(401).json({ status: 401, message: "book or user does not exist" });
        }
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//Show all or if id provided then the users Issued Books Request 
router.get("/showIssuedBooksRequest", async (req, res) => {
    try {
        const id = req.query.id;
        const page = parseInt(req.query.page) - 1 || 0;     //array starts from 0 in mongodb so minus 1
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || "";
        const searchName = req.query.searchName || "";
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const filter = {};

        if (id) {
            filter.userId = id;
        }
        if (search) {
            filter.bookName = { $regex: search, $options: "i" };
        }
        if (searchName) {
            filter.userName = { $regex: searchName, $options: "i" }
        }
        if (startDate && endDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }
        else if (startDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00))
            }
        }
        else if (endDate) {
            filter.dateOfRequisition = {
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }

        const issueList = await issuedBooks.find(filter)
            .skip(page * limit)     //skips no of documents
            .limit(limit);

        const total = await issuedBooks.countDocuments(filter);

        const response = {
            total,
            page: page + 1,
            limit,
            issueList
        }

        return res.status(201).json(response);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//To Return the individual issue book details
router.get("/getSpecificIssuedBookRequest/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const individualIssuedBook = await issuedBooks.findById(id);        //also can be written {_id : id}
        return res.status(201).json(individualIssuedBook)
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Update Book data
router.patch("/updateSpecificIssuedBookRequest/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        if (data.dateOfReturn != "" && data.dateOfReturn != null) {
            data.dateOfReturn = new Date(data.dateOfReturn);
        }
        else {
            data.dateOfReturn = null;
        }

        data.dateOfIssue = new Date(data.dateOfIssue);
        data.dateOfRequisition = new Date(data.dateOfRequisition);

        console.log(data);

        const updatedIssue = await issuedBooks.findByIdAndUpdate(id, data, { new: true });
        return res.status(201).json(updatedIssue);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Show all or if id provided then the users Issued Books Request 
router.get("/getIssuedBookListToDownload", async (req, res) => {
    try {

        const id = req.query.id;
        const search = req.query.search || "";
        const searchName = req.query.searchName || "";
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const filter = {};

        if (id) {
            filter.userId = id;
        }
        if (search) {
            filter.bookName = { $regex: search, $options: "i" };
        }
        if (searchName) {
            filter.userName = { $regex: searchName, $options: "i" }
        }
        if (startDate && endDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }
        else if (startDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00))
            }
        }
        else if (endDate) {
            filter.dateOfRequisition = {
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }

        const issueList = await issuedBooks.find(filter)

        return res.status(201).json(issueList);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})


//Accept Book Issue Request
//issue list page - credit button
router.patch("/acceptBookIssueRequest/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const issue = await issuedBooks.findOne({ _id: id })

        if (issue) {
            const book = await books.findOne({ _id: issue.bookId })

            if (book) {
                if (book.stock != 0 && issue.quantity != 0 && book.stock >= issue.quantity) {

                    book.stock -= issue.quantity;
                    await book.save();

                    issue.dateOfIssue = Date.now();
                    const newIssue = await issue.save();

                    return res.status(201).json(newIssue);
                }
                else {
                    return res.status(409).json({ status: 409, message: "Either stock is 0 or quantity asked is greater than stock." });
                }
            }
            else {
                return res.status(401).json({ status: 401, message: "Book does not exist" });
            }
        }
        else {
            return res.status(404).json({ status: 404, message: "Issue does not exist" });
        }
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Book Return Date Registration
router.patch("/bookReturn/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const issue = await issuedBooks.findOne({ _id: id })

        if (issue && issue.dateOfIssue) {

            issue.dateOfReturn = Date.now();
            await issue.save();

            return res.status(201).json(issue);
        }
        else {
            return res.status(401).json({ status: 401, message: "Issue Request has not be accepted yet." });
        }
    }
    catch (err) {
        return res.status(422).json(err);
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


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Stationary - General Item~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//To Return the Entire Items Database
router.get("/getItems", async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0;     //array starts from 0 in mongodb so minus 1
        const limit = parseInt(req.query.limit) || 6;
        const sortStock = parseInt(req.query.sortStock) || 0;
        const search = req.query.search || "";      // for itemName
        const type = req.query.type || "";

        const filter = {};

        if (search) {
            filter.itemName = { $regex: search, $options: "i" };
        }
        if (sortStock) {
            filter.stock = { $lte: sortStock };
        }
        if (type) {
            filter.itemType = { $regex: type, $options: "i" };
        }

        const itemList = await items.find(filter)
            .skip(page * limit)     //skips no of documents
            .limit(limit);

        const total = await items.countDocuments(filter);

        const response = {
            total,
            page: page + 1,
            limit,
            itemList
        }

        return res.status(201).json(response);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//To download the item database
router.get("/getItemsToDownload", async (req, res) => {
    try {
        const sortStock = parseInt(req.query.sortStock) || 0;
        const search = req.query.search || "";      // for itemName
        const type = req.query.type || "";

        const filter = {};

        if (search) {
            filter.itemName = { $regex: search, $options: "i" };
        }
        if (sortStock) {
            filter.stock = { $lte: sortStock };
        }
        if (type) {
            filter.itemType = { $regex: type, $options: "i" };
        }

        const itemList = await items.find(filter)

        return res.status(201).json(itemList);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//To Return the individual item details
router.get("/getItem/:id", async (req, res) => {
    try {
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

    try {
        const {
            itemName,
            stock,
            initialStock,
            price,
            itemType } = req.body;

        const item = await items.findOne({ itemName: itemName });     // it can also be written just bookName  //object destructuring
        console.log(item);

        if (item) {
            console.log("Server side : Item is already present.")
            return res.status(422).json("This item is already present!");
        }
        else {
            const insertedItem = await items.create({
                itemName,
                stock,
                initialStock,
                price,
                itemType
            });

            return res.status(201).json(insertedItem);
        }
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Update Item Data
router.patch("/updateItem/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const updatedItem = await items.findByIdAndUpdate(id, req.body, {new: true});
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
        return res.status(201).json(deletedItem);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Item ISSUE Related API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Register New Issue of Item
router.post("/itemIssueRequest", async (req, res) => {
    try {
        let { userId, itemId, dateOfRequisition, quantity } = req.body;

        const item = await items.findOne({ _id: itemId });
        const user = await users.findOne({ _id: userId });

        if (item && user) {

            if (dateOfRequisition == "") {
                dateOfRequisition = Date.now()
            }
            else {
                dateOfRequisition = new Date(dateOfRequisition)
            }

            const new_issue = await issuedItems.create({
                userId: user._id,
                userName: user.name,
                userDepartment: user.department,
                itemId: item._id,
                itemName: item.itemName,
                dateOfRequisition: dateOfRequisition,
                price: item.price,
                quantity
            });

            return res.status(201).json(new_issue);
        }
        else {
            return res.status(401).json({ status: 401, message: "item or user does not exist" });
        }
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//For Directly Crediting the item to user
router.post("/directAcceptItemIssueRequest", async (req, res) => {
    try {
        let { userId, itemId, dateOfRequisition, quantity } = req.body;

        const item = await items.findOne({ _id: itemId });
        const user = await users.findOne({ _id: userId });

        if (item && user) {

            if (item.stock != 0 && item.stock >= quantity) {

                if (dateOfRequisition == "") {
                    dateOfRequisition = Date.now()
                }
                else {
                    dateOfRequisition = new Date(dateOfRequisition)
                }

                const new_issue = await issuedItems.create({
                    userId: user._id,
                    userName: user.name,
                    userDepartment: user.department,
                    itemId: item._id,
                    itemName: item.itemName,
                    dateOfIssue: Date.now(),
                    dateOfRequisition: dateOfRequisition,
                    price: item.price,
                    quantity,
                });

                item.stock -= JSON.parse(quantity);
                await item.save();
                return res.status(201).json(new_issue);
            }
            else {
                return res.status(400).json({ status: 400, message: "Either stock or quantity is 0 or else quantity asked is greater than stock." });
            }
        }
        else {
            return res.status(401).json({ status: 401, message: "item or user does not exist" });
        }
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//Show all or if id provided then the users Issued Books Request 
router.get("/showIssuedItemsRequest", async (req, res) => {
    try {
        const id = req.query.id;
        const page = parseInt(req.query.page) - 1 || 0;     //array starts from 0 in mongodb so minus 1
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || "";
        const searchName = req.query.searchName || "";
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const filter = {};

        if (id) {
            filter.userId = id;
        }
        if (search) {
            filter.itemName = { $regex: search, $options: "i" };
        }
        if (searchName) {
            filter.userName = { $regex: searchName, $options: "i" }
        }
        if (startDate && endDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }
        else if (startDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00))
            }
        }
        else if (endDate) {
            filter.dateOfRequisition = {
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }

        const issueList = await issuedItems.find(filter)
            .skip(page * limit)     //skips no of documents
            .limit(limit);

        const total = await issuedItems.countDocuments(filter);

        const response = {
            total,
            page: page + 1,
            limit,
            issueList
        }

        return res.status(201).json(response);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//To Return the individual issue item details
router.get("/getSpecificIssuedItemRequest/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const individualIssuedItem = await issuedItems.findById(id);        //also can be written {_id : id}
        return res.status(201).json(individualIssuedItem)
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Update Item data
router.patch("/updateSpecificIssuedItemRequest/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        data.dateOfIssue = new Date(data.dateOfIssue);
        data.dateOfRequisition = new Date(data.dateOfRequisition);

        console.log(data);

        const updatedIssue = await issuedItems.findByIdAndUpdate(id, data, { new: true });
        return res.status(201).json(updatedIssue);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Show all or if id provided then the users Issued Items Request 
router.get("/getIssuedItemListToDownload", async (req, res) => {
    try {

        const id = req.query.id;
        const search = req.query.search || "";
        const searchName = req.query.searchName || "";
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const filter = {};

        if (id) {
            filter.userId = id;
        }
        if (search) {
            filter.itemName = { $regex: search, $options: "i" };
        }
        if (searchName) {
            filter.userName = { $regex: searchName, $options: "i" }
        }
        if (startDate && endDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }
        else if (startDate) {
            filter.dateOfRequisition = {
                $gte: new Date(new Date(startDate).setHours(00, 00, 00))
            }
        }
        else if (endDate) {
            filter.dateOfRequisition = {
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        }

        const issueList = await issuedItems.find(filter)

        return res.status(201).json(issueList);
    }
    catch (error) {
        return res.status(422).json(error);
    }
})

//Accept Item Issue Request
//issue list page - credit button
router.patch("/acceptItemIssueRequest/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const issue = await issuedItems.findOne({ _id: id })

        if (issue) {
            const item = await items.findOne({ _id: issue.itemId })

            if (item) {
                if (item.stock != 0 && issue.quantity != 0 && item.stock >= issue.quantity) {

                    item.stock -= issue.quantity;
                    await item.save();

                    issue.dateOfIssue = Date.now();
                    const newIssue = await issue.save();

                    return res.status(201).json(newIssue);
                }
                else {
                    return res.status(409).json({ status: 409, message: "Either stock is 0 or quantity asked is greater than stock." });
                }
            }
            else {
                return res.status(401).json({ status: 401, message: "Item does not exist" });
            }
        }
        else {
            return res.status(404).json({ status: 404, message: "Issue does not exist" });
        }
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

//Delete Issued Item Request
router.delete("/deleteItemIssueRequest/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deletedRequest = await issuedItems.findByIdAndDelete({ _id: id })

        console.log(deletedRequest);
        return res.status(201).json(deletedRequest);
    }
    catch (err) {
        return res.status(422).json(err);
    }
})

module.exports = router;