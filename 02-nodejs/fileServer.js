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

const getFilesList = async (req, res) => {
  try {
    const dir = path.resolve(__dirname, "./files");
    await fs.readdir(dir, "utf-8", (content) => res.status(200).json(content));
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const getFileInfo = async (req, res) => {
  try {
    const fileName = req.params.name;
    const filePath = path.resolve(__dirname, `./files/${fileName}`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      res.status(200).send(content);
    } else {
      res.status(404).send("File not found");
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

app.get("/files", getFilesList);
app.get("/file/:name", getFileInfo);

app.use((req, res) => {
  return res.status(404).send("Route not found");
});

// const port = 4000;

// app.listen(port, () => console.log(`Server started at port ${port}`));

module.exports = app;
