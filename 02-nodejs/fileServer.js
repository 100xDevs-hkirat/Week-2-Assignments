/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module*/
  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const app = express();
  port = 3000;

  //The expected API endpoints are defined below,
  //1. GET /files - Returns a list of files present in `./files/` directory
   // Response: 200 OK with an array of file names in JSON format.
    //Example: GET http://localhost:3000/files
  app.get('/files',function(req,res){
    fs.readdir(`./files/`,function(err,files){
      var arr = [];
      if(err){
        res.status(500).send("Internal Server Error");
      }
      else{
        files.forEach(element => {
          arr.push(element);
        });
        res.status(200).json(arr);
      }
    })
  })

  //2. GET /file/:filename - Returns content of given file by name
    // Description: Use the filename from the request path parameter to read the file from `./files/` directory
     //Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     //Example: GET http://localhost:3000/file/example.txt
  app.get('/file/:filename',function(req,res){
    var filename = req.params.filename;
    fs.readFile(`./files/`+filename,'utf-8', function(err,data){
      if(err){res.status(404).send("File not found");}
      else{res.status(200).send(data);}
    }
  )})

    //- For any other route not defined in the server return 404
  function notFound(req, res, next) {
    res.status(404).send('Route not found');
    next();
  }
  app.use(notFound);

    //Testing the server - run `npm run test-fileServer` command in terminal
 

//app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
