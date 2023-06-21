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
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const app = express();
var users = [];
app.use(express.json()); // Add this line to parse JSON request bodies

app.post("/signup", (req, res) => {
  const user = req.body;
  let userPresent = false;
  // for(let i = 0; i < users.length; i++) {
  //   if (users[i].username === user.username) {
  //     userpresent = true;
  //     break;
  //   }
  // }
  // or;
  for (const eachuser of users) {
    if (eachuser.username === user.username) {
      userPresent = true;
      break;
    }
  }
  if (userPresent) {
    // if user is already present
    res.sendStatus(400);
  } else {
    // user.id = uuidv4();
    //else add user to the array
    users.push(user);
    res.status(201).send("Signup successful");
  }
});

app.post("/login", (req, res) => {
  const user = req.body;
  let userFound = null;
  for (const eachuser of users) {
    if (
      eachuser.username === user.username &&
      eachuser.password === user.password
    ) {
      userFound = eachuser; // if user is found, break the loop and store the user in userFound
      break;
    }
  }
  if (userFound) {
    // return the user details if user is found
    res.json({
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
    });
  } else {
    res.sendStatus(401);
  }
});

app.get("/data", (req, res) => {
  const user = req.headers;
  userPresent = false;
  for (const eachUser of users) {
    if (eachUser.email === user.email && eachUser.password === user.password) {
      userPresent = true;
      break;
    }
  }
  if (userPresent) {
    // if user is present, return the user details
    let userData = []; // create an empty array to store the user details
    for (const eachUser of users) {
      // loop through the users array and push the user details to userData array
      userData.push({
        firstName: eachUser.firstName,
        lastName: eachUser.lastName,
        email: eachUser.email,
      });
    }
    res.status(200).send({ users: userData }); // return the userData array with key users

    //or using map
    // userData = users.map((eachUser) => {
    //   return {
    //     firstName: eachUser.firstName,
    //     lastName: eachUser.lastName,
    //     email: eachUser.email,
    //   };
    // });
    // res.status(200).send({users :userData});
  } else {
    res.sendStatus(401);
  }
});

module.exports = app;
