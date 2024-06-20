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
const bodyParser = require('body-parser');
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.json());


const users = [];

function genUUID(length = 4){
  return Math.random()*toString().substring(2,length+2);
}

function userExists(userEmail,passCheck=false) {

  for (let i =0;i<users.length;i++){
    if (users[i].email === userEmail){
      if ( !passCheck || users[i].password == passCheck)
        return i; 
    }
  }

  return -1;

}

function signup(req,res){

  const userData = req.body;
  const userEmail = userData.email;

  if (userExists(userEmail)!= -1){
    return res.sendStatus(400);
  }

  const id = genUUID();
  let newUser = userData;
  newUser.authToken = id;
  users.push(newUser);
  return res.status(201).send('Signup successful');

}


function login(req,res){

  const UserData = req.body;
  const userEmail = UserData.email;
  const UserPass = UserData.password;

  const Uid = userExists(userEmail,UserPass);
  if (Uid == -1){
    return res.sendStatus(401);
  }

  return res.status(200).json(users[Uid]);

}


function data(req,res){

  if (!req.headers.email || !req.headers.password)
    return res.sendStatus(401);

  const providedEmail = req.headers.email;
  const providedPassword = req.headers.password;
  const toSend = [];
  if (userExists(providedEmail,providedPassword) != -1){
      users.forEach((user) => {
        let obj = { firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                  };
        toSend.push(obj);          
                              });

      return res.status(200).json({users:toSend});
  }

  return res.sendStatus(401);
}


app.post('/signup',signup);
app.post('/login',login);
app.get('/data',data);
app.use('*',(req, res) => {
  res.status(404).send("Route not found");
});

module.exports = app;
