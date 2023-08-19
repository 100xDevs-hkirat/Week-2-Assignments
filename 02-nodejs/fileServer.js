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
const fs = require('fs/promises');
const app = express();
const port = 3000;

async function getFiles() {
  let files = await fs.readdir('./files')
  return files
}

app.get('/files', async (req, res) => {
  try {
    let files = await getFiles()
    return res.send(files)
  } catch (error) {
    return res.status(500).send(error)
  }
})

app.get('/file/:filename', async (req, res) => {
  try {
    let data = await fs.readFile(`./files/${req.params.filename}`, { encoding: 'utf-8' })
    return res.send(data) 
  } catch (error) {
    if (error.code == "ENOENT") return res.status(404).send("File not found")
    return res.status(500).send(error)
  }
})

app.get('*', (req, res) => {
  res.status(404).send("Route not found")
})

// app.listen(port, () => {
//     console.clear()
//     console.log(`Server is listening on port http://localhost:${port}`);
// });


module.exports = app;
