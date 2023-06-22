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

<<<<<<< HEAD
const express = require("express");
const app = express();
const bodyparser=require('body-parser');

app.use(bodyparser.json());

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
var userbase=[];
app.post('/signup',(req,res)=>{
  let userexists=false;
  const userbase1={
    "username":req.body.username,
    "password":req.body.password,
    "firstname":req.body.firstname,
    "lastname":req.body.lastname
  }
  
 
  for ( let i = 0 ; i < userbase.length ; i++){
    if(userbase[i].username===userbase1.username){
      userexists=true;
      break;
    }
  }
  userbase.push(userbase1);
  
  if(userexists){
    console.log("user already exist");
    return res.status(400).send("User already exits");
  }
  res.status(201).send("user created");
  console.log(userbase);
});

app.post('/login',(req,res)=>{
  let user_cred=req.body;
   for ( let i = 0 ; i < userbase.length ; i++){
    if(user_cred.username==userbase[i].username && user_cred.password==userbase[i].password){
      console.log("matched")
      res.status(200).send("Login successfull");
    }
   
   else{
   res.status(401).send("Bad login credentials");
   }
   }
});

app.get('/data',(req,res)=>{
  let usertoreturn=[];

  let userfound=false;

  let user_cred=req.body;

  for ( let i =0 ; i < userbase.length ; i++){
    if(user_cred.username==userbase[i].username && user_cred.password==userbase[i].password){
      userfound=true;
      break;
    }
  }
  if(userfound=true){
  for ( let i=0 ; i < userbase.length ; i++){
    usertoreturn.push({
      username:userbase[i].username,
      firstname:userbase[i].firstname,
      lastname:userbase[i].lastname
    });
  }
  res.json({usertoreturn});
}
else{
  res.sendStatus(401);
}  
});
=======
const express = require("express")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

>>>>>>> 87034ab (assignment files)
module.exports = app;
