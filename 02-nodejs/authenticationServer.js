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
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

//IMPORT THE BODY PARSER MIDDLEWARE
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//IMPORT JWT AND CREATE A SECRET KEY
const jwt = require('jsonwebtoken');
const SECRET_KEY = "100xDEV";

//USERS DATA
let usersCount = 0;
const USERS = [];


//BASIC CHECKPOINT
app.get('/',(req,res)=>{
  res.send("Everyting is OK");
})


//SIGNUP ROUTE
app.post('/signup',(req,res)=>{

  if(!req.body.email || !req.body.password)
    return res.status(401).send("Password or Email missing");

  const user = USERS.find((user)=> user.email == req.body.email);

  if(user)
    return res.status(401).send("User Already Exists");

  USERS.push({
    userName : req.body.userName,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : req.body.password,
    userId : usersCount++,
  })

  res.status(201).send("Signup successful");
})


//LOGIN ROUTE
app.post('/login',(req,res)=>{

  if(!req.body.email || !req.body.password)
    return res.status(401).send('Unauthorized');

  const user = USERS.find((user)=> user.email == req.body.email);

  if(!user)
    return res.status(401).json({msg : "No user found. Kindly Signup First"});

  if(user.password != req.body.password)
    return res.status(401).json({ msg : "Password is Incorrect "})

  const token = jwt.sign({
    userId: user.userId,
  },SECRET_KEY);

  return res.status(200).json({email:user.email,firstName:user.firstName, lastName : user.lastName,token});

})


//DATA ROUTE
app.get('/data',(req,res)=>{

  const email = req.headers.email;
  const password =req.headers.password;

  if(!email || !password)
    return res.status(401).send('Unauthorized');
  const user = USERS.find((user)=> user.email == email);

  if(!user)
    return res.status(401).json({msg:"Create an Account first"});

  if(user.password != password)
    res.status(401).json({msg : "Invalid Credentials"});

  const users = USERS.map((user) => ({
    email : user.email,
    id: user.userId,
    firstName : user.firstName,
    lastName : user.lastName,
  }))


  res.json({users});

})
  

//authenticationServer.js

//SERVER LISTENING
// app.listen(PORT,()=>{
//   console.log("App is listening on the Port");
// })

module.exports = app;
