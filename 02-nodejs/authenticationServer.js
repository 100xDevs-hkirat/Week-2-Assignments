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
const PORT = 80;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

let users = [];
app.use(express.json());

/*
task 01 : signup
*/
app.post("/signup", (req, res) => {
  const user = req.body;
  let userExist = false;
  for (let i = 0; i < users.length; i++) {
    if (user.email === users[i].email && user.username === users[i].username) {
      userExist = true;
      break;
    }
  }
  if (!userExist) {
    user["id"] = users.length + 1;
    users.push(user);
    res.status(201).send("Signup successful");
  } else {
    res.sendStatus(400);
  }
});

/*
task 02 : login
*/
app.post("/login", (req, res) => {
  const user = req.body;
  let userFound = null;
  for (let i = 0; i < users.length; i++) {
    if (
      user.username === users[i].username &&
      user.password === users[i].password
    ) {
      userFound = users[i];
      break;
    }
  }
  if (userFound) {
    res.status(200).json({
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      id: userFound.id,
      email: userFound.email,
    });
  } else {
    res.status(401).json({
      message: "invalid credentials",
    });
  }
});

/*
task 03 : data
*/
app.get("/data", (req, res) => {
  const userEmail = req.headers.email;
  const userPassword = req.headers.password;
  let userAuthorized = false;
  for (let i = 0; i < users.length; i++) {
    if (userEmail === users[i].email && userPassword === users[i].password) {
      userAuthorized = true;
      break;
    }
  }
  if (userAuthorized) {
    // let allUsers = [];
    // for (let i = 0; i < users.length; i++) {
    //   allUsers.push({
    //     firstName: users[i].firstName,
    //     lastName: users[i].lastName,
    //     email: users[i].email,
    //     id: users[i].id,
    //   });
    // }
    let allUsers = users.map((user) => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
      };
    });
    res.json({
      users: allUsers,
    });
  } else {
    res.sendStatus(401);
  }
});

/*
all other routes
*/
app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log("server running at port 3000");
});

module.exports = app;
