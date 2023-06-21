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
const app = express();
const PORT = 3000;

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
let user_db = [];
const secretKey = 'Test@12345';
app.use(bodyParser.json());

const route_checker = (req, res, next) =>{
  if(['/data', '/login', '/signup'].includes(req.url))
    next();
    else{
      res.status(404).send('Not Found');
    }
}
app.use(route_checker);
const createUser = (req, res) =>{
  let found=false;
  user_db.forEach((item)=>{
    if(item.username === req.body.username){
      found = true;
      res.status(400).send('Username already exists');
    }
  })
  if(!found){
    const token = jwt.sign(req.body, secretKey, {algorithm: 'HS256'});
    req.body.authToken = token;
    req.body.id = uuidv4();
    user_db.push(req.body);
    res.status(201).send('Signup successful');
  }
}
const login = (req, res) =>{
  let valid=false;
  user_db.forEach((item)=>{
    if(((req.body.username && item.username === req.body.username) 
        ||(req.body.email && item.email === req.body.email))
      && item.password === req.body.password){
      valid = true;
      res.status(200).send(item);
    }
  })
  if(!valid){
    res.status(401).send('Unauthorized');
  }
}
const proctectedData = (req, res) => {
  let valid=false;
  user_db.forEach((item)=>{
    if(((req.headers.username && item.username === req.headers.username) 
         ||(req.headers.email && item.email === req.headers.email))
         && item.password === req.headers.password){
      valid = true;
      res.status(200).send({users: user_db});
    }
  })
  if(!valid){
    res.status(401).send('Unauthorized');
  }
}

app.post('/signup', createUser);
app.post('/login', login);
app.get('/data', proctectedData);

//app.listen(3010, console.log(`server is running on 3010`));

module.exports = app;
