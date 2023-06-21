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
const path = require("path");
const app = express();

const filesPath = path.join(__dirname, "files"); // path.join is used to join the path segments together that is directory name and files folder to create a path to files directory

app.get("/files", (req, res) => {
  fs.readdir(filesPath, (err, files) => {
    // readdir is used to read the contents of a directory in this case the files present in files directory
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(files);
    }
  });
});

app.get("/file/:filename", (req, res) => {
  const filePath = path.join(filesPath, req.params.filename); // to create a path to the particular file passed in the url in files directory
  fs.readFile(filePath, "utf8", (err, data) => {
    // readFile is used to read the contents of the file
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.send(data);
    }
  });
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found"); // if the route is not defined in the server
});

module.exports = app;
