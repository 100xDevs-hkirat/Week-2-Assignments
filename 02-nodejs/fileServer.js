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
// const fs = require('fs');
const path = require("path");
const fs = require("node:fs/promises");
const { readFromFile } = require(__dirname + "/common/fileOperation");

// const PORT = 3001;

const app = express();

const folderPath = __dirname + "/files";

app.get("/files", async (req, res) => {
  try {
    let content = [];
    let item;
    const dir = await fs.opendir(folderPath);
    for await (const dirent of dir) {
      // console.log(dirent.name);
      item = dirent.name;
      if (content.length == 0) {
        content = [item];
      } else {
        content = [...content, item];
      }
    }
    res.status(200).send(content);
  } catch (error) {
    res.status(500).send("Error readinng input directory");
  }
});

app.get("/file/:filename", async (req, res) => {
  try {
    const file = `${folderPath}/${req.params.filename}`;
    const content = await readFromFile(file);
    res.status(200).send(content);
  } catch (err) {
    res.status(404).send("File not found");
  }
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// app.listen(PORT, console.log(`Listening on Port ${PORT}`));

module.exports = app;
