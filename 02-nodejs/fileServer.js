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

async function readFiles(folderName){
    return new Promise((resolve, reject) => {
        fs.readdir(folderName, function (err, files){
            if(err){
                reject(err.message)
            }else {
                resolve(files.map(file => file))
            }
        })
    })
}

async function readFromFile(fileName){
    return new Promise((resolve, reject) =>{
        console.log(`${__dirname}/files/${fileName}`)
        fs.readFile(`${__dirname}/files/${fileName}`, 'utf-8', function (err,FileData) {
            if(err){
                reject(err.message)
            }else {
                resolve(FileData)
            }
        })
    })
}

async function getAllFiles(req,res) {
    let results = {success:true}
    let response = null
    try {
        const files = await readFiles('files')
        results.data = files.length ? files : "No files to the folder"
        response = res.status(200).json(results)
    }catch (e) {
        results.success = false
        results.error = e
        response = res.status(500).json(results)
    }
    return response
}

async function getFileData(req,res){
    const results = {success:true}
    let response = null
    try{
        const fileName = req.params.filename
        console.log(fileName)
        const fileData = await readFromFile(fileName)
        if(fileData.length === 0){
            results.data = "Empty file"
            response = res.status(200).json(results)
        }else {
            results.data = fileData
            response = res.status(200).json(results)
        }
    }catch (e) {
        results.data = "File not found"
        results.success = false
        response = res.status(404).json(results)
    }
    return response
}

app.get("/files", getAllFiles)
app.get("/files/:filename", getFileData)

app.listen(3000,() => {
    console.log('Server running..')
})

app.use((req,res) => res.status(404))

module.exports = app;
async function abc(){
    return "hello"
}
