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

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
let users = [];
app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use((req, res, next) => {
  const {username, password} = req.body;
  if(!username || username.length == 0 || !password || password.length == 0) {
    return res.status(401).send("Unauthorize!");
  }
  next();
})

const generateRandomId = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const createUser = (username, password, firstName, lastName) => {
  const uniqueId = generateRandomId(Math.floor(Math.random() * 10) + 5);
  const user = {
    username, password, firstName, lastName, uniqueId
  }
  if (users.length != 0) {
    for(let i of users) {
      if(i.username == user.username) {
        return 0;
      }
    }
  }
  
  users.push(user);
  return 1;
}

const signup = (req, res) => {
  const {username, password, firstName, lastName} = req.body;
  if(!username || !password || !firstName || !lastName) {
    return res.status(404).send("Data not provided");
  }
  const created = createUser(username, password, firstName, lastName);
  if(!created) {
    return res.status(400).send("Username already exists");
  }
  return res.status(201).send("User Created :)");
}

const isUser = (username, password) => {
  if(users.length != 0) {
    for(let i of users) {
      if (username == i.username) {
        if(username.password == password) {
          return i;
        } else{
          return 0;
        }
      }
    }
  }
  return 0;
}

const login = (req, res) => {
  const {username, password} = req.body;
  if(!username || !password) {
    return res.status(401).send("Data not provided");
  }
  const log = isUser(username, password);
  if(!isUser) {
    return res.status(401).send("Unauthorize :(");
  }
  const token = jwt.sign(isUser, isUser.password);
  const response = {
    authToken: token
  }
  return res.status(200).json(response);
}

const getAllData = (req, res) => {
  const {username, password} = req.header;
  if(!username || !password) {
    return res.status(401).send("Unauthorized!");
  }
  const response = {users};
  return res.status(200).json(response);
}

app.post("/signup", signup);
app.post("/login", login);
app.get("/data", getAllData);
app.get("/:rand", (req, res) => {
  return res.status(404).send("Route not found :(");
})

module.exports = app;
