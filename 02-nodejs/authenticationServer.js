/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Middleware to handle bodyParser errors
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send('Bad Request');
  } else {
    next();
  }
});

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
let users = [];
let userIdIndexMapping = {};
let emailPasswordMapping = {};

function generateId() {
  return Math.random().toString(36).slice(2);
}

// Signup user
app.post('/signup', (req, res) => {
  const userBody = req.body;

  if (userBody.email in emailPasswordMapping) {
    res.status(400).send('Bad Request')
  }

  userBody.id = generateId();
  users.push(userBody);
  userIdIndexMapping[userBody.id] = users.length - 1;
  emailPasswordMapping[userBody.email] = [userBody.password, userBody.id];

  res.status(201).send('Signup successful');
});

// Login user
app.post('/login', (req, res) => {
  const userBody = req.body;
  const password = emailPasswordMapping[userBody.email][0];

  if (password && password === userBody.password) {
    const userId = emailPasswordMapping[userBody.email][1];
    const index = userIdIndexMapping[userId];
    const user = users[index];

    res.status(200).json(user);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Fetch data
app.get('/data', (req, res) => {
  const email = req.headers.email;
  const userPass = req.headers.password;
  const password = emailPasswordMapping[email][0];

  if (password && password === userPass) {
    res.status(200).json({ users: users });
  } else {
    res.status(401).send('Unauthorized');
  }

  res.status(200).send();
});

// Any other route is not found
app.use('*', (req, res) => {
  res.status(404).send('Route not found');
});

module.exports = app;
