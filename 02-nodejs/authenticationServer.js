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
const fs = require("fs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const users = [];

app.use(
  session({
    secret: "token",
    resave: false,
    saveUninitialized: true,
  })
);
//user signup
app.post("/signup", (req, resp) => {
  const user = {
    id: Math.floor(Math.random() * 1000000),
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  const index = users.findIndex((item) => item.email == user.email);
  if (index != -1) {
    resp.status(401).send("User already exist ,please login");
  } else {
    users.push(user);
    fs.appendFile(
      "/Users/akash/Desktop/MERN/Week-2-Assignments/02-nodejs/files/user.txt",
      JSON.stringify(user),
      (err, data) => {
        if (err) {
          resp
            .status(401)
            .send("Unable to add the user , please try again later");
        } else {
          resp.status(200).send("User successfully added");
        }
      }
    );
  }
});

//user login
app.post("/login", (req, resp) => {
  const cred = {
    email: req.body.email,
    password: req.body.password,
  };
  const user = users.find((item) => item.email == cred.email);
  if (user && user.password == cred.password) {
    const token = jwt.sign(user, "MIRAW6", { expiresIn: "1h" });
    req.session.token = token;
    resp.send(
      JSON.stringify(
        "First Name :" +
          user.firstName +
          " Last Name :" +
          user.lastName +
          " token :" +
          req.session.token
      )
    );
  } else {
    resp.status(404).send("User does not exist , please signup first");
  }
});

// all users list
app.get("/allUsers", (req, resp) => {
  const access_token = req.session.token;
  if (!access_token) {
    return resp.status(401).send("Unauthorized access");
  }
  try {
    const decode_token = jwt.verify(access_token, "MIRAW6");
  } catch (err) {
    return resp
      .status(404)
      .send("Some problem while retrieving the users list " + err);
  }
  const data = users.map((user) => {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  });
  const response = {
    USERS: data,
  };
  resp.status(200).send(response);
});
app.listen(PORT, () => {
  console.log(`Server started at port : ${PORT}`);
});
module.exports = app;
