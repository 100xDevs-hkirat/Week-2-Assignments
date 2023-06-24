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
const fs = require("fs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("./user");
const jwt = require("jsonwebtoken");

const secretKey = "yourSecretKey";
const PORT = 3000;
const app = express();

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.json());

function equalsIgnoreCase(str1, str2) {
  return str1.toLowerCase() === str2.toLowerCase();
}

function addUser(res, users, path) {
  updatedUsers = JSON.stringify(users);
  fs.writeFile(path, updatedUsers, (err) => {
    if (err) {
      res.status(404).send("error");
      return;
    }
  });
}

function createUser(req, res) {
  const username = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const path = "./users.json";
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      res.status(404).send("error");
      return;
    }
    const users = JSON.parse(data);
    for (let user of users) {
      if (equalsIgnoreCase(user.username, username)) {
        res.status(400).send("user already exists");
        return;
      }
    }
    const hashedPassword = bcrypt.hashSync(password, salt);
    let user = new User(
      uuidv4(),
      username,
      firstName,
      lastName,
      hashedPassword
    );
    users.push(user);
    addUser(res, users, path);
    res.status(201).send("Signup successful");
    return;
  });
}

function auhtorizeUser(req, res) {
  const username = req.body.email;
  const password = req.body.password;
  const path = "./users.json";
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      res.status(404).send("error");
      return;
    }
    const users = JSON.parse(data);
    for (let user of users) {
      if (equalsIgnoreCase(username,user.username)&&bcrypt.compareSync(password, user.password)) {
        const payload = {
          email: user.username,
          firstName: user.firstname,
          lastName: user.lastname,
        };
        const token = jwt.sign(payload, secretKey);
        res.status(200).send(payload);
        return;
      }
    }
    res.status(401).send("Unauthorized");
    return;
  });
}

function getUsers(req, res) {
  const username = req.headers.email;
  const password = req.headers.password;
  const path = "./users.json";
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      res.status(404).send("error");
      return;
    }
    const users = JSON.parse(data);
    const modifiedUser = users.map((obj) => {
      const { password, ...rest } = obj;
      return rest;
    });
    const response = {users:modifiedUser};
    for (let user of users) {
      if (equalsIgnoreCase(username,user.username)&&bcrypt.compareSync(password, user.password)) {
        res.status(200).send(response);
        return;
      }
    }
    res.status(401).send("Unauthorized");
    return;
  });
}

app.post("/signup", createUser);
app.post("/login", auhtorizeUser);
app.get("/data", getUsers);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
module.exports = app;
