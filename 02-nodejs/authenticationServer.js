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
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

let users = []

app.use(express.json());

//************************************SIGNUP*************************************** */

app.post('/signup', signupHandler);

function signupHandler(req, res) {
  console.log(users);
  const requestBody = req.body;
  const userName = requestBody.userName;
  
  users.forEach(element => {
    if(element.userName === userName) {
      res.status(400).send('Bad request user already exists');
      return;
    }
  });

  const userObject = {
    "_id": users.length + 1,
    "userName": userName,
    "password": requestBody.password,
    "firstName": requestBody.firstName,
    "lastName": requestBody.lastName,
  }

  users.push(userObject);
  res.status(201).send('Signed up successfully');
}


//************************************LOGIN*************************************** */

app.post('/login', loginHandler);

function loginHandler(req, res) {
  const requestBody = req.body;
  const userName = requestBody.userName;
  const password = requestBody.password;
  
  users.forEach((element) => {
    if(element.email === userName && element.password === password) {
      res.status(200).json({
        _id: element._id,
        userName : element.userName,
        firstName : element.firstName,
        lastName : element.lastName
      })
      return;
    } 
  });

  res.status(401).send('Un-authorized access');
}


//************************************GET DETAILS*************************************** */


app.get('/data', (req, res) => {
  const userName = req.headers['userName'];
  const password = req.headers['password'];

  users.forEach((element) => {
    if(element.userName === userName && element.password === password) {    
      res.status(200).json({users: [element]})
      return;
    }
  })

  res.status(401).send('Un-authorized access');
})

app.listen(PORT);

module.exports = app;