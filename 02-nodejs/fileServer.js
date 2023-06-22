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
const port= 3000;

app.listen(port,()=>{
  console.log("server started on port",+port);
})

app.get('/files',(req,res)=>{
  const filepath=path.join(__dirname,'files');
  fs.readdir(filepath,(err,files)=>{
    if(err){
      console.log("An error occured",err);
      res.status(500).json({error:"Internal Server Error"});
      return;
    }
    res.status(200).json(files);
  })
})

app.get('/files/:name', (req, res) => {
  const filename = req.params.name;
  const filepath = path.join(__dirname, 'files');

  console.log('Filename:', filename); // Debugging: Check if filename is correctly received
  console.log('Filepath:', filepath);

  fs.readFile(path.join(filepath, filename), 'utf-8', (err, file) => {
    if (err) {
      console.log("An error occurred", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    
    res.status(200).send(file);
  });
});

app.get('*',(req,res)=>{
  res.status(404).send('not found');
})


module.exports = app;
