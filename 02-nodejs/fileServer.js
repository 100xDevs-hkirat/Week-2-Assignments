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

//For Windows the "\" has to be replaced with "/""
//var target_dir="C:/Users/Admin/OneDrive - White Cap/Desktop/projects/files_read"

//var fullPath = path.join(__dirname, target_dir)
//console.log(__dirname);
//console.log(target_dir);

app.listen(3001, () => {
  console.log("Application has Started.")
})


app.get('/files', (req,res) => {
  var target_dir="C:/Users/Admin/OneDrive - White Cap/Desktop/projects/files_read"
  fs.readdir(target_dir, (files, error) => {
    if(error) {
      console.log(error);
      return res.status(200).send(error);    
  }  

    console.log(files)
    res.status(200).send(files);
  })
})



app.get("/files/:filename", (req, res) => {
  const file_name="C:/Users/Admin/OneDrive - White Cap/Desktop/projects/files_read/"+req.params.filename;
  fs.readFile(file_name, 'utf-8', (err, data) => {
    if(err){
      console.log(err);
      return res.status(200).send("404 Not Found");
    }
  
    console.log(data);
    res.status(200).send(data);
})
})


app.get('/*', (req,res) => {
  res.status(200).send("404 Not Found");
})


module.exports = app;
