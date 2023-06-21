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
const {readdir, access, readFile} = require('fs/promises');
const path = require('path');
const app = express();

async function fileExist(file){
  try{
    await access(path.join(__dirname,"files",file))
    return true
  }
  catch(e){
    return false
  }   
}

app.get("/files",async(req, res)=>{
  try{
  const files = await readdir(path.join(__dirname,"files"))
  return res.send(files)
  }
  catch(e){
    console.log(e)
    return res.sendStatus(500)
  }
  
})

app.get("/file/:filename",async (req,res)=>{
  const found = await fileExist(req.params.filename)
  if(!found){
    return res.status(404).send("File not found")}
  const content = await readFile(path.join(__dirname,"files",req.params.filename))
  console.log(content.toString())
  res.sendFile(path.join(__dirname,"files",req.params.filename))
})

app.get("*",(req,res)=>{
  return res.status(404).send("Route not found")
})


module.exports = app;

// app.listen("8080")