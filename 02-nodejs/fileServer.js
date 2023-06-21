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

const route_checker = (req, res, next) =>{
  if(req.url.includes('/file'))
    next();
    else{
      res.status(404).send('Route not found');
    }
}
app.use(route_checker);

const fetchAllFiles = (req, res) => {
  const readDirec = (err, files) => {
    err ? res.status(500).send('Internal server error') : 
      res.status(200).send(files);  
  }
 fs.readdir(path.resolve(__dirname, './files'), readDirec);
}
const fetchSpecficFileContent = (req, res) => {
  const filename = req.params['filename'];
  const fileRead = (err, data) => {
    err ? res.status(404).send('File not found') : res.status(200).send(data);
  }
  fs.readFile(path.resolve(__dirname, `./files/${filename}`), "utf-8", fileRead);
}
app.get('/files', fetchAllFiles);
app.get('/file/:filename', fetchSpecficFileContent);

//app.listen(3010, console.log(`server is running on 3010`));

module.exports = app;
