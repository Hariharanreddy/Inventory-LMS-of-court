const fs = require("fs")
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

// app.use(cors({
//     allowedHeaders: "*",
//     allowedMethods: "*",
//     origin:"*",
// }));

app.use(cors());

// app.options("/", (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     res.sendStatus(204);
// });
  
app.use(express.static("static"))
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "static/index.html"));
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BACKUP RELATED COMMANDS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 1. Cron expression for every 5 seconds - */5 * * * * *
// 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// Note: 2nd expression only contains 5 fields, since seconds is not necessary

//for 7:30pm, enter '30 19 * * *'

// cron.schedule('*/5 * * * * *', () => backupMongoDB());

// function backupMongoDB() {

//     var d = new Date();
//     var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + "-" +
//         d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();

//     const DB_NAME = 'Item-Manager-1';
//     const ARCHIVE_PATH = path.join(__dirname, './public', `${DB_NAME}_backup_${datestring}.gzip`);


//     const child = spawn('mongodump', [
//         `--db=${DB_NAME}`,
//         `--archive=${ARCHIVE_PATH}`,
//         '--gzip',
//     ]);

//     child.stdout.on('data', (data) => {
//         console.log('stdout:\n', data);
//     });
//     child.stderr.on('data', (data) => {
//         console.log('stderr:\n', Buffer.from(data).toString());
//     });
//     child.on('error', (error) => {
//         console.log('error:\n', error);
//     });
//     child.on('exit', (code, signal) => {
//         if (code) console.log('Backup not successful, Process exit with code:', code);
//         else if (signal) console.log('Backup not successful, Process killed with signal:', signal);
//         else console.log('Backup is successfull ✅');
//     });
// }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CODE FOR DELETING FILES IF MORE THAN 3~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// const folder = '../server/public';

// cron.schedule('* * * * * *', () => {
//     fs.readdir(folder, (err, files) => {
//       if (err) throw err;

//       // check if there are more than 3 files in the folder
//       if (files.length > 3) {
//         // sort the files by their creation time
//         files.sort((a, b) => {
//           let fileA = path.join(folder, a);
//           let fileB = path.join(folder, b);
//           return fs.statSync(fileA).ctime.getTime() - fs.statSync(fileB).ctime.getTime();
//         });

//         // delete the oldest file
//         let oldestFile = path.join(folder, files[0]);
//         fs.unlink(oldestFile, (err) => {
//           if (err) throw err;
//           console.log(`${files[0]} has been deleted`);
//         });
//       }
//     });
//   });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.listen(port, () => {
    console.log(`Server is started at port number ${port}`);
});

