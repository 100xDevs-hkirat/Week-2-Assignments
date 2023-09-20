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

const express = require("express");
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const users = [];

app.post("/signup", handleSignUp);
app.post("/login", handleLogin);
app.get("/data", isAuthenticated, getAllUsers);
app.use((_, res) => {
  res.status(404).send("Route not found");
});

function handleSignUp(req, res) {
  const { email, password, firstName, lastName } = req.body;

  if (users.length > 0) {
    const foundUserIndex = users.findIndex((user) => user.email === email);
    if (foundUserIndex > -1) res.status(400).send("Email already exists");
  }

  users.push({
    email,
    password,
    firstName,
    lastName,
  });

  res.status(201).send("Signup successful");
}

function handleLogin(req, res) {
  const { email, password } = req.body;

  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!foundUser) res.status(401).send("Invalid Credentials");

  res.json({
    email: foundUser.email,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    authToken: generateToken(24),
  });
}

function generateToken(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charset.length);
    token += charset[index];
  }

  return token;
}

function isAuthenticated(req, res, next) {
  const { email, password } = req.headers;

  const foundUserIndex = users.findIndex(
    (user) => user.email === email && user.password === password
  );

  if (foundUserIndex > -1) next();
  else res.status(401).send("Unauthorized");
}

function getAllUsers(req, res) {
  const formattedUsers = users.map((user) => {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  });

  res.json({ users: formattedUsers });
}

module.exports = app;
