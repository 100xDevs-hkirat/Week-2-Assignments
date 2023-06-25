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
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.json());


var users = [];

app.post("/signup", (req, res) => {
  var newUser = req.body;
  for (const user of users) {
    if (user.email === newUser.email) {
      res.status(400).send("User already exists!!!");
    }
  }
  const id = Math.floor(Math.random() * 100000);
  newUser.id = id;
  users.push(newUser);
  res.status(201).send("Signed up successgully!!!");
});

app.post("/login", (req, res) => {
  const {userName, password} = req.body;

  for(const user of users){
    if(user.userName === userName){
      if(user.password === password){
        const token = jwt.sign({userName}, "qwertyuiop098765");
        res.send({token: token});
      }
      else{
        res.status(401).send("password incorrect");
      }
    }
    else{
      res.status(401).send("User not found");
    }
  }
})

app.get("/data", (req, res) => {
  const token = req.headers.authorization;

  if(token){
    try{
      const decodedToken = jwt.verify(token, 'qwertyuiop098765');
      console.log(decodedToken);
      var data = [];
      for(const user of users){
        var obj = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        }
        data.push(obj);
      }
      res.send(data);
    }
    catch(err){
      res.status(401).send("Invalid token!!!");
    }
  }
  else{
    res.status(401).send("Missing token!!");
  }

})

app.get("/users", (req, res) => {
  res.send(users);
})


app.listen(3000, () => {
  console.log("Port is started on 3000");
})

module.exports = app;
