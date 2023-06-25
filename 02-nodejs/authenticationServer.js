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

const express = require('express')
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

let users = [];

app.use(express.json());

app.post('/signup', (req, res) => {
  const obj = req.body;
  const id = Math.floor(Math.random() * 10000);
  let userAlreadyExists = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === obj.email) {
      userAlreadyExists = true;
      break;
    }
  }
  if (userAlreadyExists) {
    return res.status(400).send('Bad Request');
  } else {
    users.push({
      ...obj,
      id
    });
    return res.status(201).send('Signup successful');
  }
}); 

app.post('/login', (req, res) => {
  const obj = req.body;
  let validUser = false;
  let index = -1;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === obj.email && users[i].password === obj.password) {
      validUser = true;
      index = i;
      break;
    }
  }
  if (validUser) {
    let token = {
      firstName: users[index].firstName,
      lastName: users[index].lastName,
      email: users[index].email,
      id: users[index].id
    };
    return res.status(200).json(token);
  } else {
    return res.status(401).send('Inavlid user');
  }
});

app.get('/data', (req, res) => {
  let email = req.headers.email;
  let password = req.headers.password;
  let validUser = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      validUser = true;
      break;
    }
  }
  if (validUser) {
    return res.status(200).json({users});
  } else {
    return res.status(401).send('Unauthorized');
  }
});

app.all('*', (_, res) => {
  res.status(404).send('Route not found');
});


module.exports = app;
