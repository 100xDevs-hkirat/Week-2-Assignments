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

//to get all files in a directory
app.get("/files", (req, resp) => {
  fs.readdir(
    "/Users/akash/Desktop/MERN/Week-2-Assignments/02-nodejs/files",
    (err, files) => {
      if (err) {
        return resp
          .status(404)
          .send("Problem while retrieving the files " + err);
      } else {
        resp.status(200).send(JSON.stringify(files));
      }
    }
  );
});

//to get particular file content
app.get("/file/:filename", (req, resp) => {
  const filename = req.params.filename;
  console.log(filename);
  fs.readFile(
    `/Users/akash/Desktop/MERN/Week-2-Assignments/02-nodejs/files/${filename}`,
    (err, data) => {
      if (err) {
        return resp.status(401).send("Error while reading the file " + err);
      } else {
        resp.status(200).send(data);
      }
    }
  );
});
app.use((req, res, next) => {
  res.status(404).send("Route is not defined");
});
app.listen(3000, () => {
  console.log("Server running at port 3000");
});
module.exports = app;
