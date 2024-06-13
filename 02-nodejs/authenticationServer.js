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

class User{
  constructor(uname, pwd, fname,lname){
      this.email = uname;
      this.password = pwd;
      this.firstName = fname;
      this.lastName = lname;
  }
  getEmail(){
    return this.email;
  }
  setEmail(email){
    this.email = email;
  }
  getPassword(password){
    return this.password;
  }
  setPassword(password){
    this.password = password;
  }
  getfirstName(firstName){
    return this.firstName;
  }
  setFirstName(firstName){
    this.firstName = firstName;
  }
  
}

const express = require("express")
var bodyParser = require('body-parser')
// const port = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.json());

var users = [];

function handleSignUp(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  
  const user = new User(email, password, firstName, lastName);
  for(let i = 0; i < users.length; i++){
      if(users[i].getemail() === email){
          res.status(400).send("User already exisit");
          return;
      }
  }
  users.push(user);
  res.status(201).send("Signup successful");
}

function handleLogIn(req, res){
  var email = req.body.email;
  var password = req.body.password;
  
  for(let i = 0; i < users.length; i++){
      if(users[i].getEmail() === email && users[i].getPassword() === password){
          // res.status(200).send("Auth Token : "+generateAuthToken());
          res.status(200).json(users[i]);
          return;
      }
  }
  res.status(401).send("credentials are invalid");
}

function generateAuthToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

function handleGetData(req, res){
  var email = req.headers.email;
  var password = req.headers.password;
  
  for(let i = 0; i < users.length; i++){
      if(users[i].getEmail() === email && users[i].getPassword() === password){
          res.status(200).json({users});
          return;
      }
  }
  res.status(401).send("Unauthorized");
} 

app.post('/signup',  handleSignUp);
app.post('/login',  handleLogIn);
app.get('/data',  handleGetData);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app;
