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
var users = [];
let userId = 0;

app.use(express.json());


function dataFunction(req, res){
  const email = req.headers.email;
  const password = req.headers.password;
  var isProtected = false;
  for(var i=0;i<users.length;i++){
    if(users[i].email === email && users[i].password === password){
      isProtected = true;
      break;
    }
  }

  if(isProtected){
    var arr = [];
    for(var i=0;i<users.length;i++){
      arr.push({
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        email: users[i].email
      })
    }

    res.status(200).json({users: arr})
  }

  else{
    res.status(401).send("Unauthorized!");


  }
};


function signupFunction(req, res){
  const isPresent = false;
  var user1 = req.body;
  users.forEach((user) => {
    if(user === user1.email){
      isPresent = true;
    }
  });

  if(isPresent){
    res.status(400).send("User already exists");
  }

  else{
    const user1Id = {firstName: user1.firstName, lastName: user1.lastName, email: user1.email, password: user1.password};
    users.push(user1Id);
    res.status(201).send("Signup successful");
  }
};


function loginFunction(req, res){
  var user = req.body;
  var isUser = null;
  for(var i=0;i<users.length;i++){
    if(users[i].email === user.email && users[i].password === user.password){
        isUser = users[i];
        break;
    }
  }

  if(isUser){
    res.status(200).json({
      firstName: isUser.firstName,
      lastName: isUser.lastName,
      email: isUser.email
  });
  }
  else{
    res.sendStatus(401);
  }
}

app.post("/signup", signupFunction);
app.post("/login", loginFunction);
app.get("/data", dataFunction);


module.exports = app;
