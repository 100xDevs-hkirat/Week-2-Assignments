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

const express = require("express")
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

/* const PORT = 3000;
app.listen(PORT, () => {
  console.log('App is listening on the port:', PORT);
}); */
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server


let users = [];

app.post('/signup', (req, res) => {
  if (findUser(req.body.email) !== -1) {
    res.status(400).send('User Already Exists');
  } else {
    users.push({
      id: Math.floor(Math.random() * 10000),
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    res.status(201).send('Signup successful');
  }

});

app.post('/login', (req, res) => {
  let findUserIndex = findUser(req.body.email);
  if (findUserIndex === -1) {
    return res.status(401).send('Unauthorized');
  }
  let user = users[findUserIndex];
  let checkUser = authenticateUser(user, req.body.password);

  if (checkUser) {
    return res.json({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  }
  res.status(401).send('Unauthorized');

});

app.get('/data', (req, res) => {
  let email = req.headers.email;
  let password = req.headers.password;
  let check = typeof email !== 'undefined' && email !== '' && typeof password !== 'undefined' && password !== '';

  let checkUser;

  if (check) {
    let findUserIndex = findUser(email);
    if (findUserIndex === -1) {
      return res.status(401).send('Unauthorized');
    }
    let user = users[findUserIndex];
    checkUser = authenticateUser(user, password);
  } else {
    return res.status(401).send('Unauthorized');
  }

  if (checkUser) {
    let data = []
    for(let user of users){
      data.push({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
    res.json({'users': data});
  } else {
    return res.status(401).send('Unauthorized');
  }
});


function findUser(email){
  return users.findIndex(user => user.email === email);
}

function authenticateUser(user, password){
  return user.password === password;
}

module.exports = app;
