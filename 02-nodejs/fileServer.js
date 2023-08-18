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
const port = 3001;


app.get('/files', (req, res) => {
  fs.readdir('./files', (err, files) => {
    if (err) throw new Error(err)
    res.send(files)
  })
})

app.get('/files/:file', (req, res) => {
  fs.readFile(`./files/${req.params.file}`, { encoding: 'utf-8' }, (err, data) => {
    if (err) throw new Error(err)
    res.send(data)
  })
})

app.get('*', (req, res) => {
  fs.readdir('./files', (err, files) => {
    if (err) throw new Error(err)
  
    let filesList = ''
    files.forEach(file => {
      filesList+= `<li> <a href="http://localhost:${port}/files/${file}">/${file}</a> </li>`
    })
  
    let html = `
      <h1>Available routes:</h1>
      <ul>
        <li> <a href="http://localhost:${port}/files">/files</a> </li>
        ${filesList}
      </ul>
    `
    res.status(404).send(html)
  })
})

app.listen(port, () => {
    console.clear()
    console.log(`Server is listening on port http://localhost:${port}`);
});


module.exports = app;
