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
const bodyParser = require("body-parser")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

const users = [];

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Authentication Server");
});

app.post("/signup", (req, res) => {
  const id = users.length === 0 ? 1 : users[users.length - 1].id + 1;
  if (users.some((user) => user.username === req.body.username)) {
    res.status(400).send("Username already exists!");
  } else {
    users.push({
      id: id,
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    });
    res.status(201).send("Signup successful");
  }
});

const isValidUser = (username, password, sendUser = false) => {
  const userIdx = users.findIndex((user) => {
    if (user.username === username && user.password === password) {
      return true;
    }
    return false;
  });

  if (userIdx != -1) {
    if (sendUser) {
      return users[userIdx];
    } else {
      return true;
    }
  } else {
    return false;
  }
};

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const currentUser = isValidUser(username, password, true);

  if (currentUser) {
    res.status(200).send({
      id: currentUser.id,
      email: currentUser.email,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName
    });
  } else {
    res.status(401).send("Invalid username or password");
  }
});

app.get("/data", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  if (isValidUser(username, password)) {
    res.send({ users });
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => {
  console.log("Listening on", PORT);
});

module.exports = app;
