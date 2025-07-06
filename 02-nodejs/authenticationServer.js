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
const { v4: uuidv4 } = require("uuid");
const { sign } = require("jsonwebtoken");

const { jwtAuth, authenticate } = require(__dirname +
  "/middleware/authentication");

const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json());

let users = [];

app.post("/signup", (req, res) => {
  try {
    // console.log(req.body);
    const { email, password, firstName, lastName } = req.body;
    const user = users.length > 0 && findUser(email, password);
    if (user) {
      res.status(400).send("User already exists");
      return;
    }
    const id = uuidv4();
    users = [...users, { id, ...req.body }];
    res.status(201).send("Signup successful");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/mySignup", (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const user = getUser(username, password);
  if (user) {
    res.status(400).send("User already exists");
    return;
  }
  const id = uuidv4();
  users = [...users, { id, ...req.body }];
  res.status(201).send("Signup successful");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.length > 0 && findUser(email, password);
  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  }
  res.status(200).send({
    accesstoken: createAccessToken(user.id),
    message: "User login successfully",
    ...user,
  });
});

app.post("/myLogin", (req, res) => {
  const { username, password } = req.body;
  const user = getUser(username, password);
  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  }
  res.status(200).send({
    accesstoken: createAccessToken(user.id),
    message: "User login successfully",
  });
});

app.get("/getUsers", jwtAuth, (req, res) => {
  const id = req.id;
  const user = users.find((user) => user.id === id);

  if (!user) return res.status(400).send("Authentication failed");
  res.status(200).send(users);
});

app.get("/data", authenticate, (req, res) => {
  // const user = users.find(
  //   (user) => user.email === req.email && user.password === req.password
  // );
  const user = users && findUser(req.email, req.password);

  if (!user) return res.status(401).send("Unauthorized");
  res.status(200).send({ users });
});

const getUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user;
};

const findUser = (email, password) => {
  const user =
    users &&
    users.find((user) => user.email === email && user.password === password);
  return user;
};

const ACCESS_TOKEN_SECRET =
  "gsPAhGCA@PWNX@wfyzDraz!4E!L_KDFgQY6kRbzRj3y@*YhRKgPDo6Grwpud";

const createAccessToken = (id) => {
  return sign({ id }, ACCESS_TOKEN_SECRET);
};

// app.listen(PORT, () => console.log(`Listening for requests on port: ${PORT}`));

module.exports = app;
