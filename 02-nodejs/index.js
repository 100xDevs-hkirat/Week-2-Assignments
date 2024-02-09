const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const port = 3000;
let arr = [];

app.use(bodyParser.json()); // Enable parsing of JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Enable parsing of URL-encoded form data

function handlereq(req, res) {
  res.send(arr);
}

function handlereq2(req, res) {
  arr.push(req.body); // Push the parsed request body into the arr array
  res.send("ok");
}
// chilling 
app.get('/', handlereq);
app.post('/', handlereq2);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
