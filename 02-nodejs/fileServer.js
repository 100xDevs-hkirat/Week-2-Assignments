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
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

//Number of files and files name
app.get("/files", (req, res) => {
  const directoryPath = path.dirname("../02-nodejs/files/text/");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.send("Internal Server Error !");
    }

    const fileNames = files.map((file, index) => `${index + 1} . ${file}`);
    console.log(fileNames);
    res.json({
      fileName: fileNames,
      noOfFiles: files.length,
    });
  });
});

//Read file and send them

app.get("/files/:fileName", (req, res) => {
  const fileNameParams = req.params.fileName;

  const directoryPathFile = `../02-nodejs/files/${fileNameParams}`;
  fs.readFile(directoryPathFile, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.status(404).send("File Not Found");
      } else {
        console.log("Error Reading File :", err);
        res.status(500).send("INTERNAL SERVER ERROR");
      }
    } else {
      if (!data.length) {
        res.send("File is empty.");
      } else {
        res.send(data);
      }
    }
  });
});

app.use((req, res) => {
  res.send("404 NOT FOUND!");
});
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

module.exports = app;
