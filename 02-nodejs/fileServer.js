/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require("express");
const fs = require("fs");
const fsProm = require("fs/promises");
const path = require("path");
// const bodyParser = require('body-parser')
const app = express();

// app.use(bodyParser.json())

app.get("/files", (req, res, next) => {
  // fsProm
  //   .readdir("./files")
  //   .then((data) => res.send(data))
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).send({ msg: "could not read the directory" });
  //   });

  fs.readdir("./files", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Internal server occured");
    }
    res.send(data);
  });
});

app.get("/file/:fileName", (req, res, next) => {
  const fileName = req.params.fileName;
  // console.log(fileName);
  fsProm
    .readFile("./files/" + fileName, "utf-8")
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.status(404).send("File not found");
    });
});

app.get("/*", (req, res, next) => {
  res.status(404).send("Route not found");
});

// app.listen(3000, () => {
//   console.log("node is running at port 3000");
// });

module.exports = app;
