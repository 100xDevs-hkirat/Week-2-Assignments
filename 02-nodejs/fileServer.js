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
const app = express();

const port = 3000;

/*
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files
*/
app.get("/files", function(req, res){
  let dirLocation = req.url;
  dirLocation = "." + dirLocation + "/";
  fs.readdir(dirLocation, function(err, dirFiles){
    if(err){
      res.status(500).send("Internal Server Error");
    }
    res.status(200).send(dirFiles);
  })
});

/*
  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt
*/
app.get("/file/:filename", function(req, res){
  let fileLocation = req.params.filename;
  fileLocation = "./files/" + fileLocation;
  fs.readFile(fileLocation, "utf-8", function(err, data){
    if(err){
      res.status(404).send("File not found");
      return;
    }
    res.status(200).send(data);
  })
});

// for any other route, just return 404 status and Not Found text
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Used listen method for testing purpose
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app;
