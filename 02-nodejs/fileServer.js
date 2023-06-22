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
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();
app.use(bodyParser.json());

const getFilesDetails = (req, res) => {
  fs.readdir(path.join(__dirname, './files'), (err, files) => {
    if(err) res.status(500).send("Internal server error.");

    res.status(200).send(files);
  })
}

const sendFileData = (req, res) => {
  let file = req.params.filename;

  fs.readdir(path.join(__dirname, './files'), (err, files) => {
    if(err) res.status(500).send("Internal server error.");

    if(files.includes(file)) {
      fs.readFile(path.join(__dirname, "./files", `./${file}`), "utf-8", (err, data) => {
        if(err) console.log(err);
        res.status(200).send(data);
      });
    } else {
      res.status(404).send("File not found")
    }
  })
}


app.get('/files', getFilesDetails);
app.get('/file/:filename', sendFileData);

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
})


app.listen(port, () => console.log(`server running on port ${port}`));

module.exports = app;
