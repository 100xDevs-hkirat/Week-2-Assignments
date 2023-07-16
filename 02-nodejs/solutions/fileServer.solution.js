const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())


app.get('/files',(req,res) =>{
	fs.readdir('./files',(err,files) =>{
		if(err) throw err;
		res.send(files);
	});
});

app.get('/files/:fileName',(req,res) =>{
	let fileNames = req.params.fileName
	fs.readFile('./files/'+fileNames,'utf8',(err,files) =>{
		if(err) throw err;
		res.json(JSON.parse(files));
	});
});

app.listen(3000)