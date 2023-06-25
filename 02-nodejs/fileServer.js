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
const PORT = 8000;

function listFileMethod(req,res){
  directoryPath = './files';
  function fileReadFunc(error,files){
    if (error) {
      res.status(500).send("Internal Server Error");
    }
    else{
      res.status(200).send(JSON.stringify(files));
    }
  }
  
  fs.readdir(directoryPath, fileReadFunc);
  
}

app.get("/files",listFileMethod);

function showFileContent(req,res){
  var files = fs.readdirSync('./files');
  var flag = false;
  for(var i=0;i<files.length;++i){
    if(files[i]==req.params.fileName){
      flag =  true;
      break;
    }
  }

  if(flag){
    res.status(200).sendFile(__dirname + '/files/' + req.params.fileName);
  }
  else{
    res.status(404).send("File not found");
  }
}

app.get("/file/:fileName",showFileContent);


function undifRoutes(req,res){
  res.status(404).send('Route not found');
}

app.get('*', undifRoutes);

function started() {
  console.log(`Example app listening on port ${PORT}`)
}

// app.listen(PORT, started);


module.exports = app;
