
const express = require("express");
const mongoose = require("mongoose");

require("./db/conn");
const books = require("./models/Book List/bookSchema");
const items = require("./models/Stationary List/itemsSchema")

const cors = require("cors");
const router = require("./routes/router");

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
    res.json("server start")
})

app.listen(port, () => {
    console.log(`server is started at port number ${port}`);
});