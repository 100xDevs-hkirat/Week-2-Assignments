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
const port = 3000;
const url = require('url');

let trimmedPath

function seperatePath(req,res,next)
{
  let parseUrl = req.url;
  let path = parseUrl.pathname;

  let slash = parseUrl.lastIndexOf('/');
   trimmedPath = parseUrl.slice(slash);
   console.log(`path is ${parseUrl}`);
 // trimmedPath = path.replace(/^\/+|\/+$/g,'');
  console.log(req.url);
  console.log(typeof(req.url))

  next();
}


app.use(seperatePath);

app.get('/files', (req,res) =>{

 let fileNames =  fs.readdirSync(`.${trimmedPath}`);

console.log(typeof(fileNames))
let fileList =[];
 console.log(`List of FileNames are :`);
 fileNames.forEach((file)=>{

  fileList.push({File:file})

  console.log(`File: ${file}`);
 })

 res.send(JSON.parse(JSON.stringify(fileList)));

console.log('http server is on')
})

function readFileContents(req,res){

  let file = req.params.fileName;

 let fileData = fs.readFile(`./files/${file}`,'utf-8',(err,data)=>{

    res.send(data);
    console.log(data);

  })
console.log(fileData)
}

app.get('/file/:fileName',readFileContents)

app.get('/Test',(req,res)=>{
console.log(`inside test`)
})



app.listen(port,()=>{

  console.log(`Listening to port ${port}`)
})





module.exports = app;
