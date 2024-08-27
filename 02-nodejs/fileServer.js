const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const directoryPath = path.join(__dirname, 'files')

function showFileNames(req, res){
  
  fs.readdir(directoryPath, (err, files) =>{
    if (err){
      res.status(500).json({error: "Unable to read file names"})
    }
          res.json(files)
})
  }

function readFileContents(req, res){
const fileName = req.params.filename;
const filePath = path.join(directoryPath, fileName)

  fs.readFile(filePath, 'utf8', (err, data) =>{
    if(err){
      res.status(404).send("File not found")
    }

    res.send(data)
  })
}

app.get('/files', showFileNames)
app.get('/file/:filename', readFileContents)

app.use((req,res) =>{
  res.status(404).send("Route not found")
})

function started(){
  console.log(`Example app listening on port${port}`)  
}

app.listen(port, started);

module.exports = app;
