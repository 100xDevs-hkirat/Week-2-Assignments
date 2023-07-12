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
const PORT = 3000;
const express = require('express');
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

function name(req, res) {
  const files = fs.readdirSync('./files');
  res.status(200).json(files);
}

app.get('./files', name);

function read_file(err, fileContent, res) {
  if (err) {
    console.error('Error reading file:', err);
    res.status(500).send('Error reading file');
    return;
  }
  res.type('text/plain').send(fileContent);
}

function content(req, res) {
  var file_name = req.body.filename;
  var filePath = `./files/${file_name}`;
  fs.readFile(filePath, 'utf-8', (err, fileContent) => {
    read_file(err, fileContent, res);
  });
}
app.get('/filescontent', content);

function started() {
  console.log(`Example app listening on port ${PORT}`)
}

app.listen(PORT, started)
module.exports = app;
