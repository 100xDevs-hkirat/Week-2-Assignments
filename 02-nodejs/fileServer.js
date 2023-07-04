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


function allFiles(req, res){
  const fullPath = path.join(__dirname, './files')

  fs.readdir(fullPath, (error, files) => {
    if (error) console.log(error)
    // files.forEach( file => console.log(file))
    let x = {files};
    // res.send(x);
    res.json(x)
  })
}
app.get('/files', allFiles);

function readFromFile(req, res){
  let fileName = req.params.file;
  console.log(fileName);
  fs.readFile(`./files/${fileName}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return "File not found";
    }
    console.log(data);
  });
  res.send("welcome");
}

app.get('/files/:file', readFromFile)

app.listen(3001, () => {
  console.log("app is listening on port 3001");
})
// app.listen(3001);

module.exports = app;
