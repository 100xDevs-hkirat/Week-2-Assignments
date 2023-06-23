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

    Testing the server - run `npm run ` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Server port
var port = 3000;

const directoryPath = __dirname + '\\files';

// GET /files
app.get('/files', (req, res) => {
  // Read files from the directory
  fs.readdir(directoryPath, (err, files) => {
    // Unable to get to the directory, send status:500
    if (err) {
      res.status(500).send("Failed to retrieve files");
    }
    // Directory found, continue.
    else{
      var output = [];

      // Add the names of all the files into an array and send it as part of the response
      files.forEach((file) => {
        output.push(file);
      });
      res.status(200).send(output);
    } 
  })
});

// GET /file/:filename
app.get('/file/:filename', (req, res) => {

  // Get the file name from URL
  const fileName = req.params.filename;

  // Read files from the directory
  fs.readdir(directoryPath, (err, files) => {
    // Unable to get to the directory, send status:500
    if (err) {
      res.status(500).send("Failed to retrieve files");
    }
    // Directory found, continue.
    else{
      var fileNotFound = true;

      // Check if the requested file is present in the directory
      files.forEach((file) => {
        // File found. Send the contents as part of the response.
        if(fileName == file){
          fileNotFound = false;
          const filePath = path.join(directoryPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          console.log(fileContent);
          res.status(200).send(fileContent);
        }
      })
      // File not found
      if(fileNotFound){
        res.status(404).send("File not found");
      }
    }
  })
});

// for all other routes, return 404
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Start the listener
function started(){
  console.log(`File Server listening on port: ${port}`);
}
app.listen(port, started);

module.exports = app;