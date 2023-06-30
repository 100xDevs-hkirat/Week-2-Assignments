/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with userEmail, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the userEmail already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with userEmail and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users userEmail and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the userEmail and password in headers are valid, or 401 Unauthorized if the userEmail and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var users = [];
app.use(express.json());

app.post('/signup', (req, res) => {
  console.log('POST: signup requested');
  uuid = uuidv4();
  const userEmail = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  console.log("userEmail: " + userEmail);
  var userFound = false;
  for(var i=0;i<users.length;i++) {
    if(users[i].email===userEmail){
      userFound = true;
      break;
    }
  }

  if(userFound){
    // userEmail Found
    res.status(400).send("Username already exists");
  }
  else {
    users.push({ 
      'email': userEmail, 
      'password': password, 
      'firstName': firstName, 
      'lastName': lastName, 
      'id': uuid 
    });
    res.status(201).send("Signup successful");
  }
})

app.post('/login', (req, res) => {
  console.log('POST: Login requested');
  const userEmail = req.body.email;
  const password = req.body.password;
  let userFound = null;
  for (var i = 0; i<users.length; i++) {
    if (users[i].email === userEmail) {
      userFound = users[i];
      break;
    }
  }
  if (userFound) {
    if (userFound.password === password) {
      res.status(200).json({ 
        email: userFound.email,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
       });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
})

app.get('/data', (req, res) => {
  console.log('GET: Data requested');
  const userEmail = req.headers.email;
  const password = req.headers.password;
  var userFound = false;
  for(var i = 0; i<users.length; i++){
    if(users[i].email === userEmail && users[i].password === password){
      userFound = true;
      break      
    }
  }
  if(userFound){
    result = []
    for(var i=0;i<users.length;i++){
      result.push({
        'firstName': users[i].firstName,
        'lastName': users[i].lastName,
        'id': users[i].id
      })
    }
    res.json({
      'users': result
    })
  }
  else {
    res.sendStatus(401);
  }

})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

// for all other routes, return 404
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

module.exports = app;
