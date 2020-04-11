"use strict";

const http = require("http");
const fs = require("fs");

const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");

const Router = express.Router;
const upload = multer({ dest: "tmp/csv/" });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;

router.post("/", upload.single("file"), function (req, res) {
  const fileRows = [];
  console.log(req.file.path);
  // open uploaded file
  csv
    .fromPath(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      // console.log(fileRows);
      fs.unlinkSync(req.file.path); // remove temp file
      var i;
      var resArray = [];
      fileRows.shift();
      for (i = 0; i < fileRows.length; i++) {
        resArray[i] = fileRows[i][1];
      }
      var resJSON = JSON.stringify(resArray);
      res.send("test");
      //process "fileRows" and respond
    });
});

app.use("/upload-csv", router);

// Start server
function startServer() {
  server.listen(port, function () {
    console.log("Express server listening on ", port);
  });
}

setImmediate(startServer);
