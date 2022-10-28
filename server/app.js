
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("./db/conn");

const cors = require("cors");
const router = require("./routes/router");

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(port, () => {
    console.log(`Server is started at port number ${port}`);
});