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
    Description: Gets user back their details like firstName, lastName and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstName, lastName and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstName/lastName.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const PORT = 3000;
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

const users = [];

app.post("/signup", (req, res) => {
  const id = Math.floor(Math.random() * 1000000);
  const { email, password, firstName, lastName } = req.body;
  const newUser = {
    id: id,
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
  };
  let userExits = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      userExits = true;
      break;
    }
  }

  if (userExits) {
    res.status(400).json();
  } 
  else {
    users.push(newUser);
    res.status(201).send("Signup successful");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let validUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      validUser = users[i];
      break;
    }
  }

  if (validUser) {
    res.json({
      email: validUser.email,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
    });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

app.get("/data", (req, res) => {
  const { email, password } = req.headers;
  let validUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      validUser = users[i];
      break;
    }
  }

  if (validUser) {
    res.json({  users, });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// app.listen(PORT, () => {
//   console.log(`running on ${PORT}`);
// });

module.exports = app;
