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

const DIR_PATH = path.join(__dirname, "files");

app.get("/files", getFiles);
app.get("/file/:filename", getFileByName);
app.use((_, res) => {
  res.status(404).send("Route not found");
});

function getFiles(req, res) {
  return fs.readdir(DIR_PATH, (err, files) => {
    if (err) throw err;

    res.json(files);
  });
}

function getFileByName(req, res) {
  const fileName = req.params.filename;

  if (!fileName) res.status(400).send({ error: "No file name specified" });

  return fs.readdir(DIR_PATH, (err, files) => {
    if (err) throw err;

    const isFileFound = files.indexOf(fileName) > -1;

    if (isFileFound) {
      readFromFile(path.join(DIR_PATH, fileName), (err, data) => {
        if (err) throw err;

        res.send(data);
      });
    } else {
      res.status(404).send("File not found");
    }
  });
}

function readFromFile(filePath, cb) {
  return fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return cb(err);

    return cb(null, data);
  });
}

module.exports = app;
