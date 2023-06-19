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


function getFileNames(req, res) {
  fs.readdir('./files','utf-8', (err, files) => {
    if (err) {
      return res.status(500).json({ error:"Failed to retrieve files" });
    }
    res.json(files);
  });
}

function getFileContentsByName(req, res) {
  const fileName = req.params.name;
  const filesList = fs.readdirSync(path.join(__dirname, './files'), 'utf-8');
  
  if(filesList.includes(fileName)) {
    try {
      const fileContent = fs.readFileSync(path.join(__dirname, 'files', fileName), 'utf-8');
      res.status(200).send(fileContent);
    } catch(err) {
      res.status(500).send('Internal error');
    }
  } else {
    res.status(404).send('File not found');
  }
}

app.get('/files', getFileNames);

app.get('/file/:name', getFileContentsByName);

// app.use((req, res) => {
//   res.status(404).send("Route not found");
// });

app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});

// app.get()
// getFileNames(null, null);
// getFileContentsByName({ params:{ name:"a.txt" } });
module.exports = app;

