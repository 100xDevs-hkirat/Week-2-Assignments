/**
import * as res from 'express/lib/response'
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
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const FILE_PATH = path.join(__dirname, 'files')

app.get('/files', (_, res) => {
  fs.readdir(FILE_PATH, (err, files) => {
    if (err) {
      res.status(500).send('Error while reading directory', err)
    }

    res.status(200).json(files)
  })
})
app.get('/file/:filename', (req, res) => {
  fs.readFile(
    path.join(FILE_PATH, req.params.filename),
    'utf8',
    (err, data) => {
      if (err) {
        res.status(404).send('File not found')
      }
      res.status(200).send(data)
    }
  )
})

app.use((_, res) => {
  res.status(404).send('404 - Not Found')
})

module.exports = app
