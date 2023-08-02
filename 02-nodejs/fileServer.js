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
let files = [];


const readdirr = () => {
  const fileAr = fs.readdirSync("./files", "utf-8", (err, data) => {
    if(err) {
      return 0;
    }
    files = data;
    return files;
  });
  if(fileAr != 0) {
    return fileAr;
  }
}

const callback = (err, files) => {
  if(err) {
    return 0;
  }
  return files;
}

const dirContent = (path) => {
  const response = fs.readdirSync(path, callback);
  if(response != 0) {
    return response;
  }
  return 0;
}

const getFiles = (req, res) => {
  const files = dirContent("./files");
  if(files == 0) {
    return res.status(404).send("Not found")
  }
  const response = {files}
  console.log(response)
  return res.status(200).json(response);
}



const getFileContent = (req, res) => {
  const fileAr = readdirr();
  const {fileName} = req.params;
  if(fileAr.find(file => fileName == file) == undefined) {
    fs.writeFileSync('./files/notFound.txt', "File not found", (err) => 0)
    return res.status(404).send("File not found")
  }
  let content = fs.readFileSync(`./files/${fileName}`, callback);
  content = content.toString();
  const response = {content}
  return res.status(200).send(content);
}


app.get('/files', getFiles);
app.get('/file/:fileName', getFileContent);
app.get("/:any", (req, res) => {
  return res.status(404).send("Not found");
});
app.listen(3001)

module.exports = app;
