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
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const users = [];

app.use(bodyParser.json());

// 1
app.post("/signup", (req, res) => {
  for (const user of users) {
    if (user["username"] === req.body.username) {
      res.sendStatus(404);
    }
  }

  const newUser = req.body;
  const id = Math.floor(Math.random() * 100000) + 1;
  newUser["id"] = id;
  users.push(newUser);
  res.status(201).send("Signup successful");
});

// 2
app.post("/login", (req, res) => {
  for (const user of users) {
    if (
      user["username"] === req.body.username &&
      user["password"] === req.body.password
    ) {
      res.json({
        email: user["email"],
        firstName: user["firstName"],
        lastName: user["lastName"],
      });
    }
  }
  res.sendStatus(401);
});

// 3
app.get("/data", (req, res) => {
  let isValidUser = false;

  for (const user of users) {
    if (
      user["username"] === req.headers.username &&
      user["password"] === req.headers.password
    ) {
      isValidUser = true;
    }
  }

  let userToReturn = [];

  if (isValidUser) {
    for (const user of users) {
      userToReturn.push({
        firstName: user["firstName"],
        lastName: user["lastName"],
        email: user["email"],
      });

      res.json({ users: userToReturn });
    }
  }
  res.sendStatus(401);
});

app.use((req, res, next) => {
  res.status(404).send();
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports = app;
