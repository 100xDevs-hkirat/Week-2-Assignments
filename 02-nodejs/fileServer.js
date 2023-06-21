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
const fsP = require('fs/promises')
const path = require('path');
const app = express();



app.get("/files", (req, res) => {
    fs.readdir("./files", (err, files) => {
        if(err){
            console.log(`Error reading directory ${err}`)
            res.status(500).send(`Error reading directory ${err}`)
            return
        }
        res.send(files)
    })
})

app.get("/file/:fileName", async (req, res) => {
    try{
        let files = await fsP.readdir("./files")
        if(files.some(fileName => fileName === req.params.fileName)){
            let fileText = await fsP.readFile(`./files/${req.params.fileName}`, "utf-8")
            res.send(fileText)
        }
        else{
            res.status(404).send("File not found")
        }        

    }catch(err){
        res.status(500).send(`Error accessing/reading file ${err}`)
    }   
      
})

app.use((req, res, next) => {
    res.status(404).send('Route not found')
})

// var port = 3000 
// app.listen(port, () => console.log(`Started listening ${port}`))

module.exports = app;
