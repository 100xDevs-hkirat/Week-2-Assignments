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
const bodyParser = require("body-parser")
const PORT = 8000;
const app = express();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var users = []

app.use(bodyParser.json());

function idGen(){
  return Math.random().toString(36).substring(2, 6+2);
}

function signUpMethod(req,res){
  var flag = false;
  for(var i=0;i<users.length;++i){
      if(users[i].email==req.body.email){
        flag=true;
        break;
      }
  }
  if(flag){
    res.status(400).send("email already exists");
  }
  else{
    var obj = {
      id: idGen(), 
      email: req.body.email,
      password:req.body.password,
      firstName:req.body.firstName,
      lastName:req.body.lastName
    }
    users.push(obj);
    res.status(201).send("Signup successful");
  }
  console.log(users);

}

app.post("/signup",signUpMethod);

function loginMethod(req,res){
  var flag=false;
  var i;
  l1:for(i=0;i<users.length;++i){
    if(req.body.email==users[i].email){
      {
        if(req.body.password==users[i].password){
          flag=true;
          break l1;
        }
      }
    }
  }
  if(flag)
  {
    var token = jwt.sign({ id: users[i].id }, "secretx", {
    expiresIn: 86400 // expires in 24 hours
    });
    const resJson=JSON.stringify({ 
      email: users[i].email, 
      firstName: users[i].firstName,
      lastName: users[i].lastName, 
      authTtoken: token 
    })
    res.status(200).send(resJson);
  }
  else{
    res.status(401).send("Invalid Credentials");
  }
}

app.post("/login",loginMethod);

function showMethod(req,res){
  var flag=false;
  var i;
  l1:for(i=0;i<users.length;++i){
    if(req.headers.email==users[i].email){
      {
        if(req.headers.password==users[i].password){
          flag=true;
          break l1;
        }
      }
    }
  }
  if(flag){
    var userData=[];
    for(i=0;i<users.length;++i){
      var obj = {
        email:users[i].email,
        firstName:users[i].firstName,
        lastName:users[i].lastName
      }
      userData.push(obj)
    }
    const resJson = JSON.stringify({"users":userData});
    res.status(200).send(resJson);
  }else{
    res.status(401).send("Unauthorized");
  }
}

app.get("/data",showMethod);

function undifRoutes(req,res){
  res.status(404).send('page not found');
}

app.get('*', undifRoutes);

function started() {
  console.log(`Example app listening on port ${PORT}`)
}

// app.listen(PORT, started)

module.exports = app;
