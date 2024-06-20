/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the globalUsers and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows globalUsers to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all globalUsers like firstname, lastname and id in an array format. Returned object should have a key called globalUsers which contains the list of all globalUsers with their email/firstname/lastname.
    The globalUsers username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const globalUsers = [];
const globalUsersMap = new Map();

app.post('/signup',(req,res)=>{
  if(globalUsersMap.has(req.body.username)){
    res.status(400).send("Bad Request.User already exists.");
  }else{
    let newUser = {
      id: 100 + Math.floor((Math.random() * 100) + 1),
      username : req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email : req.body.email
    }
    globalUsers.push(newUser);
    globalUsersMap.set(newUser.username,newUser);
    res.status(201).send('Signup successful');
  }
})

app.post('/login',(req,res)=>{
  let reqUsername = req.body.username;
  let reqPassword = req.body.password;
  if(globalUsersMap.has(reqUsername) && reqPassword===globalUsersMap.get(reqUsername).password){
    res.status(200).send(globalUsersMap.get(reqUsername));
  }else{
    res.status(401).send('Unauthorized');
  }
})


app.get('/data',(req,res)=>{
  let reqUsername = req.headers.username;
  let reqPassword = req.headers.password;
  if(globalUsersMap.has(reqUsername) && reqPassword===globalUsersMap.get(reqUsername).password){
    let resUser = {
      users: [globalUsersMap.get(reqUsername).firstName]
    }
    res.status(200).send(resUser);
  }else{
    res.status(401).send('Unauthorized');
  }
})

// function started(){
//   console.log(`Example app ${PORT}`);
// }
// app.listen(PORT,started)

module.exports = app;
