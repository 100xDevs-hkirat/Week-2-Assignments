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
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Jwt = require("jsonwebtoken");

const path = require("path");

const dotenvAbsolutePath = path.join(__dirname, '.env');

const dotenv = require('dotenv').config({ path: dotenvAbsolutePath});

const validation = require('./validation');
const validate = require('./validationMiddleware');
const auth = require("./auth");

const PORT = 3000;
const app = express();
require('dotenv').config();

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const users = [];
app.use(bodyParser.json());

app.post('/signup', (req, res) => {

  const {
    error
  } = validation.validate(req.body);
  if (error) {
    res.status(422)
      .send(error.details[0].message);
  } else {

    let user = req.body;
    let userAlreadyExists = false;

    for (let i = 0; i < users.length; i++) {
      if (users[i].email === user.email) {
        userAlreadyExists = true;
        break;
      }
    }
    if (userAlreadyExists) {
      res.status(400).send(`Bad request user: ${user.email} already exists!!!`);
    }

    user['id'] = uuidv4();
    users.push(user);
    console.log(user);
    res.status(201).send('Signup successful');
  }
});
app.post('/login', (req, res) => {
    let user = req.body;
    let userFound = null;

  for(let i =0; i< users.length; i++){
    if(users[i].email === user.email && users[i].passsword === user.passsword){
      userFound = users[i];
      break;
    }
  }

  if(userFound){
   
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
 
    let data = {user_id: userFound.id, email: userFound.email};
    const token = Jwt.sign(data, jwtSecretKey);

    res.status(200).json({
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
      authToken: token
    });
    
  }
  else{
    res.status(401).send("Unauthorized invalid credentials");
  }

});

app.get('/data',(req, res) =>{

  let email = req.headers.email;
  let password = req.headers.password;

  let userFound = null;

  for(let i=0; i<users.length; i++){
    if(users[i].email === email && users[i].password === password ){
      userFound = users[i];
      break;
    }
  }
    let usersData = [];
    if(userFound){
      for(let i=0; i<users.length;i++){
        usersData.push({
          firstName: users[i].firstName,
          lastName: users[i].lastName,
          id: users[i].id

        })
      }
      res.status(200).json({users: usersData});
    }
    else{
      res.status(401).send("Unauthorized")
    }
  

});

app.get('/datawithtoken', auth,(req, res) =>{

    let usersData = [];
    if(req.user){
      for(let i=0; i<users.length;i++){
        usersData.push({
          firstName: users[i].firstName,
          lastName: users[i].lastName,
          id: users[i].id

        })
      }
      res.status(200).json({users: usersData});
    }
    else{
      res.status(401).send("Unauthorized!!")
    }

});

function started() {
  console.log(`Example app listening on port ${PORT}`);
}
//app.listen(PORT, started);
module.exports = app;