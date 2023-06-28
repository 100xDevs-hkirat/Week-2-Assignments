/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const secret = 'mysecretkey';

let users = [];

function hashPassword(password) {
  // Generate a salt with 10 rounds
  const salt = bcrypt.genSaltSync(10);

  // Hash the password with the salt
  const hash = bcrypt.hashSync(password, salt);

  // Return the hash
  return hash;
}

// Define a function to generate tokens using jsonwebtoken
function generateToken(user) {
  // Create a payload with the user id and username
  const payload = {
    id: user.id,
    username: user.username
  };

  // Sign the token with the secret key and an expiration time of 1 hour
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  // Return the token
  return token;
}

function comparePassword(password, hash) {
  // Use bcrypt to compare the plain text password and the hashed password
  console.log(password, hash);
  return bcrypt.compare(password, hash);
}


app.post('/signup', (req, res) => {
  const newUser = {
    id: Math.floor(Math.random() * 1000000), // unique random id
    username: req.body.username,
    password: hashPassword(req.body.password),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email };
    const user = users.find(user => user.username === req.body.username);
  if (user) {
    res.status(400).send();
  } else {
    users.push(newUser);
    res.status(201).send('Signup successful');
  }
});

app.post('/login', async (req, res) => {
  const user = users.find(user => user.username === req.body.username);
  const match = await comparePassword(req.body.password, user.password);
  if (user && match) {
    const token = generateToken(user);
    const tokenObj = { token: token, ...user };
    res.status(200).json(tokenObj);
  } else {
    res.status(401).send();
  }
});

app.get('/data', async (req, res) => {
  const token = req.headers.authorization;
  if (req.headers.email && req.headers.password) {
    try {
      // const payload = jwt.verify(token, secret);
      const user = users.find(user => user.email === req.headers.email);
      console.log(user);
      const match = await comparePassword(req.headers.password, user.password);
      if (user && match) {
        console.log(user);
        res.json({ users: users });
      } else {
        res.status(401).send('Unauthorized');
      }
    } catch (err) {
      console.log(err);
      res.status(401).send('Unauthorized');
    }
  } else {
    res.status(401).send('Unauthorized');
  }
});

// for all other routes, return 404
app.use((req, res, next) => {
  res.status(404).send();
});

// app.listen(3000);


module.exports = app;
