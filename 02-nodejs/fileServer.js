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
const { error } = require('console');
const express = require('express');
const fs = require('fs/promises');
const fs2 = require('fs');
const path = require('path');
const app = express();

const port = 3001
module.exports = app;



app.get('/files', (req, res) => {
  fs2.readdir(path.join(__dirname, './files/'), (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve files' });
    }
    res.json(files);
  });
});

// app.get('/files', readDirectory)
// function readDirectory(req, res) {

//   fs.readdir(path.join(__dirname, './files/'))
//     .then(files => res.status(200).json(files))
//     .catch(err => res.status(500).json({ error: 'Failed to retrieve files' }))
// }

app.get('/file/:fileName', readFileContent)


function readFileContent(req, res) {
  let fileName = req.params.fileName

  fs.readFile(__dirname + '/files/' + fileName, 'utf8')
    .then((data) => res.status(200).send(data))
    .catch((error) => res.status(404).send("File not found"))
}



// for all other routes, return 404
app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});
//app.listen(port, () => console.log("Server strted at port " + port))