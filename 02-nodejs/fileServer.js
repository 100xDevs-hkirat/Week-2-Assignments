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
const fullPath = path.join(__dirname, 'files');

function getFilesInDir() {
	return new Promise((resolve, rejects) => {
		fs.readdir(fullPath, (error, fileNames) => {
			if (error) {
				rejects(error);
			}
			resolve(fileNames);
		});
	});
}
function getFileData(fileName) {
	return new Promise((resolve, rejects) => {
		const filePath = path.join(fullPath, fileName);
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) rejects(err);
			else resolve(data);
		});
	});
}

app.get('/files', (req, res) => {
	getFilesInDir()
		.then(fileNames => {
			res.status(200).send(fileNames);
		})
		.catch(err => {
			res.status(500).send('Internal Server Error');
		});
});
app.get('/file/:filename', (req, res) => {
	let fileName = req.params.filename;
	getFileData(fileName)
		.then(fileContent => {
			res.status(200).send(fileContent);
		})
		.catch(err => {
			res.status(404).send('File not found');
		});
});

// handle routes not found
app.use((req, res, next) => {
	res.status(404).send('Route not found');
});

module.exports = app;
