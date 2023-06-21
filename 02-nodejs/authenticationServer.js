/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    +Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users 
    which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

const express = require("express");
const bodyparser = require("body-parser");
const PORT = 3000;
const app = express();

app.use(bodyparser.json());

let users = [];
let userid = 0;

app.post("/signup", (req, res) => {
  let user = req.body;

  users.forEach((u) => {
    if (u.email === user.email) {
      res.status(400).send("User Already Exisits");
      return;
    }
  });

  users.push(user);
  res.status(201).send("Signup successful");
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  const token = Math.random().toString(36).substring(2);

  uid = users.findIndex((user) => user.email === email);

  if (uid != -1 && password == users[uid].password) {
    //console.log(user);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({
      firstName: users[uid].firstName,
      lastName: users[uid].lastName,
      email: users[uid].email,
    });
  } else {
    res.status(401).send("User doesn't exist or password is incorrect!");
  }
});

app.get("/data", (req, res) => {
  let email = req.headers.email;
  let password = req.headers.password;
  console.log(email, password);
  uid = users.findIndex((user) => user.email === email);

  if (uid !== -1 && password === users[uid].password) {
    let usersdata = [];

    users.forEach((user) => {
      usersdata.push({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });

    res.status(200).json({ users: usersdata });
  } else {
    res.sendStatus(401);
  }
});

app.use((req, res) => {
  // Handle the request for the default route here
  res.status(404).send("404 Not Found - default route");
});

/* let port = 3003;
app.listen(3003, function () {
  console.log(`Demo application is listening on port ${port}`);
});
 */
module.exports = app;
