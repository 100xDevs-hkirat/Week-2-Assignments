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
const port = 3001

// var files = fs.readdirSync('./files');
// var filePath = path.join(__dirname,files[0])
// console.log(files[0])
// console.log(filePath)
// fs.readFile( './files/'+files[0], "utf-8", (err, data)=>{
// if(err){
// console.log(err)
// }else{
//   console.log(data)
// }
// })

function getAllFilesHandle(req, res){
  var files = fs.readdirSync('./files');
  
  console.log(files)
  result = {
    "fileList":files
  }
  res.status(200).send(files)
}

app.get('/files',getAllFilesHandle)

function getFileContent(req, res){
  const fileName  =req.params.fileName
  
  function readFileContent(err, data){
    console.log(data)
    res.status(200).send(data)
  }
  fs.readFile('./files/'+fileName,'utf-8',readFileContent)
  

}

app.get('/files/:fileName', getFileContent)

app.listen(port, ()=>{
  console.log(`file server running on port ${port}`)
})
