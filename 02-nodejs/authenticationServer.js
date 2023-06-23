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
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

const USERS = [];

app.use(bodyParser.json());

app.post("/signup", (req, res, next) => {
  let { email, password, firstName, lastName } = req.body;
  const id = Math.random();

  let user = USERS.find((user) => user.email === email);
  if (user) {
    return res.send(400).status("User already exists");
  }
  const newUser = { id, email, password, firstName, lastName };
  USERS.push(newUser);
  res.status(201).send("Signup successful");
});

app.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  let user = USERS.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).send("Credentials Unauthorized");
  }
  res.send({
    email,
    firstName: user.firstName,
    lastName: user.lastName,
    authToken: Math.random().toString(),
  });
});

const isAuth = (req, res, next) => {
  const { email, password } = req.headers;
  let user = USERS.find(
    (user) => user.email === email && user.password === password
  );
  console.log(user);
  if (!user) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

app.get("/data", isAuth, (req, res, next) => {
  const data = USERS.map(function ({ id, firstName, lastName }) {
    return { id, firstName, lastName };
  });
  res.send({ users: data });
});

app.use("/*", (req, res, next) => {
  res.status(404).send("Invalid route");
});

// app.listen(3000, () => {
//   console.log("server running at port 3000");
// });

module.exports = app;
