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
const port = 3000

module.exports = app;

callback = () =>
{
  console.log(`HTTP fileServer running at port ${port}`)
}

app.listen(port , callback)

//  1> GET /files

getContaines = (req , res) =>
{
  fs.readdir(path.join(__dirname , `./files/`) , (err , data) =>
  {
    if (err)
    {
      console.err(err)
    }
    else
    {
      res.json(data) 
    }
  })
}

app.get(`/files` , getContaines)

// 2> GET /file/:filename

getFile = (req ,res) =>
{
    fs.readFile(path.join(__dirname , `./files/` , req.query.filename) , (err , value) =>
    {
      if (err)
      {
          console.err(err)  
      }
      else
      {
          res.json(value)  
      }
    })
}

app.get(`/file/:filename` , getFile)

// For Any other routes 

app.use((req ,res , next) =>
{
  res.send("Path doesn't exist")
})