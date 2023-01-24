const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("./db/conn");

const cors = require("cors");
const router = require("./routes/router");

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BACKUP RELATED COMMANDS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// var d = new Date();
// var curr_date = d.getDate();
// var curr_month = d.getMonth();
// var curr_year = d.getFullYear();
// var today_date = curr_date + "-" + curr_month + "-" + curr_year;

// const DB_NAME = 'Item-Manager-1';
// const ARCHIVE_PATH = path.join(__dirname, './public', `${DB_NAME}_backup_${today_date}.gzip`);

// // 1. Cron expression for every 5 seconds - */5 * * * * *
// // 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// // Note: 2nd expression only contains 5 fields, since seconds is not necessary

// //for 7:30pm, enter '30 19 * * *'
// cron.schedule('*/5 * * * * *', () => backupMongoDB());

// function backupMongoDB() {
//   const child = spawn('mongodump', [
//     `--db=${DB_NAME}`,
//     `--archive=${ARCHIVE_PATH}`,
//     '--gzip',
//   ]);

//   child.stdout.on('data', (data) => {
//     console.log('stdout:\n', data);
//   });
//   child.stderr.on('data', (data) => {
//     console.log('stderr:\n', Buffer.from(data).toString());
//   });
//   child.on('error', (error) => {
//     console.log('error:\n', error);
//   });
//   child.on('exit', (code, signal) => {
//     if (code) console.log('Process exit with code:', code);
//     else if (signal) console.log('Process killed with signal:', signal);
//     else console.log('Backup is successfull ✅');
//   });
// }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.listen(port, () => {
    console.log(`Server is started at port number ${port}`);
});

