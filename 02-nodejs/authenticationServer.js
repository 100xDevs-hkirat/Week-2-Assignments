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
const bodyParser = require('body-parser')
let jwt = require('jsonwebtoken');

let userInfo = [];
let userIdx = 0;


// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
function userSignUp(req, res)
{
  console.log(req.body);
  if(userInfo.length > 0 && userInfo.has(body.username))
  {
    res.status(400).send('Username already exists')
  }

  let userObj = {
    username : req.body.username,
    password : req.body.password,
    firstName : req.body.firstName,
    lastName : req.body.lastName
  }

  userInfo[userIdx] = userObj;
  userIdx++;
  res.status(201).send('User created');
}

function userLogin(req, res)
{
  body = req.body;
  idx = userInfo.indexOf(body.username)
  if( idx == -1 || (userInfo[idx].password !== body.password))
  {
    res.status(401).send('Credentials are invalid')
  }

  let userdata = {
    username: body.username,
    password: body.password
  };

  let token = jwt.sign(userdata, global.config.secretKey, {
    algorithm: global.config.algorithm,
    expiresIn: '1m'
  });
  res.status(200).json({
    message: 'Login Successful',
    jwtoken: token
    });
}

function getUserData(req, res)
{

}

app.use(bodyParser.json());
app.post('/signup', userSignUp);
app.post('/login', userLogin);
app.get('/data', getUserData);

app.get('*', function (req, res) {
  res.status(404).send('Route not found');
});

function started()
{
    console.log(`Example app listening on port 3000`)
}
app.listen(3000, started);

module.exports = app;
