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
const bodyParser = require("body-parser");
const app = express();
const { v4: uuidv4 } = require("uuid");

app.use(bodyParser.json());

let users = [
  // {
  //   email: "dummy@dummy.com",
  //   password: "abc",
  //   firstName: "dummy",
  //   lastName: "kumar",
  // },
  // {
  //   email: "rome@rome.com",
  //   password: "rome",
  //   firstName: "romemy",
  //   lastName: "romepo",
  // },
  // {
  //   email: "robber@robber.com",
  //   password: "robber",
  //   firstName: "robbery",
  //   lastName: "robs",
  // },
];

function postSignup(req, res) {
  let newUser = req.body;
  if (users.find((user) => user.email == newUser.email)) {
    res.status(400).send("(400 Bad Request) Email already exists!");
  } else {
    const id = uuidv4();
    newUser = {
      ...newUser,
      id: id,
    };

    users.push(newUser);
    res.status(201).send("Signup successful");
  }
  console.log(users);
}

function postLogin(req, res) {
  const { email, password } = req.body;
  const loggedUser = users.find((user) => {
    return user.email === email && user.password === password;
  });

  if (loggedUser) {
    res.status(200).json({
      id: loggedUser.id,
      email: loggedUser.email,
      firstName: loggedUser.firstName,
      lastName: loggedUser.lastName,
      token: "random token",
    });
  } else {
    res.status(401).send("Unauthorized");
  }
}

function getData(req, res) {
  const { email, password } = req.headers;
  const authorizedUser = users.find((user) => {
    return user.email === email && user.password === password;
  });
  if (authorizedUser) {
    console.log(users.length);
    res.status(200).send(users);
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.post("/signup", postSignup);
app.post("/login", postLogin);
app.get("/data", getData);

module.exports = app;
