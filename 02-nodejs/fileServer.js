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
    const fs = require('fs').promises; // Used promises version of fs 
    const path = require('path');
    const app = express();
    
    app.use(express.json());
    
    const listOfFiles = async (req, res) => {
      try {
        const files = await fs.readdir('./files');
        res.status(200).json(files);
      } 
      catch (error) {
        res.sendStatus(500);
      }
    };
    
    const getFileContent = async (req, res) => {
      const { filename } = req.params;
      const filePath = `./files/${filename}`;
      
      try {
        const stats = await fs.stat(filePath);
    
        if (!stats.isFile()) {
          res.status(404).send("File not found");
          return;
        }
    
        const fileContent = await fs.readFile(filePath, 'utf8');
        res.status(200).send(fileContent);
      } 
      catch (error) {

        res.status(404).send("File not found");
      }
    };
    
    app.get('/files', listOfFiles);
    app.get('/file/:filename', getFileContent);
    
    app.use((req, res) => {
      res.status(404).send("Route not found");
    });
    
    module.exports = app;
    