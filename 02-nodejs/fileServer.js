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

function getFiles(req, res) {
  const path = "./files";
  let files = [];
  fs.readdir(path, (err, contents) => {
    if (err) {
      res.status(500).send("error");
      return;
    }
    for (const content of contents) {
      files.push({ filename: content });
    }
    res.status(200).send(files);
  });
}
function showFile(res, location) {
  fs.readFile(location, "utf-8", (err, data) => {
    if (err) {
      res.status(404).send("error");
      return;
    }
    res.status(200).send(data);
  });
}
function getFile(req, res) {
  const filename = req.params.filename;
  const location = "./files";
  fs.readdir(location, (err, contents) => {
    if (err) {
      res.status(404).send("error");
      return;
    }
    for (const content of contents) {
      if (content == filename) {
        showFile(res, path.join(location, content));
        return;
      }
    }
    res.status(404).send("File not found");
    return;
  });
}

app.get("/files", getFiles);
app.get("/file/:filename", getFile);
app.use((req, res, next) => {
  res.status(404).send("Route not found");
  next();
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening in port ${port}`);
});

module.exports = app;
