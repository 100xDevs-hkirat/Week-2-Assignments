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
const bodyParser = require('body-parser');
app.use(bodyParser.json());
var userDataBase = [];



// POST /signup - User Signup
app.post('/signup', (req, res) => {

  const userPresent = userDataBase.find(obj => obj.email === req.body.email);
  var invalidRequest = false;

  // Check for bad request
  if(req.body.email == undefined || req.body.password == undefined || 
    req.body.firstName == undefined || req.body.lastName == undefined){
      invalidRequest = true;
    }

  // email already exist, send 400 Bad Request
  if (userPresent || invalidRequest){
    res.status(400).send("Bad Request");
  }
  // This is a new usename, add it to the database
  else{
    // Read data from the body of signup request
    const newUser = {
      id: Math.floor(Math.random() * 1000000), // unique random id
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    // Add the user deatils to user database and send 201 status.
    userDataBase.push(newUser);
    res.status(201).send("Signup successful");
  }
});



// POST /login - User Login
app.post('/login', (req, res) => {

  // Check to see if we have this user in our database
  const userPresent = userDataBase.find(obj => obj.email === req.body.email);

  // email/user already exist, check for valid credentials. 
  if (userPresent && (userPresent.password == req.body.password)){

    // User has valid credentials.
    var userInfo = {
      email: userPresent.email,
      firstName: userPresent.firstName,
      lastName: userPresent.lastName
    }

    res.status(200).send(userInfo);
  }
  // Send Unauthorized access
  else{
    res.status(401).send("Unauthorized");
  }
});




// GET /data - Fetch all user's names and ids from the server
app.get('/data', (req, res) => {

  // Check to see if we have this user in our database
  const userPresent = userDataBase.find(obj => obj.email === req.headers.email);
  console.log(req.headers.email, req.headers.password, req.body.email, req.body.password)

  // email/user already exist, check for valid credentials. 
  if (userPresent && (userPresent.password == req.headers.password)){

    // User has valid credentials.
    var usersToSend = [];
    for (var x of userDataBase){
      var user = {
        id: x.id,
        email: x.email,
        firstName: x.firstName,
        lastName: x.lastName
      }
      usersToSend.push(user);
    }

    // Send the response with key "users"
    res.status(200).send({users: usersToSend});
  }
  // Send Unauthorized access
  else{
    res.status(401).send("Unauthorized");
  }
});



// Start the listener
function started(){
  console.log(`Authentication Server listening on port: ${PORT}`);
}
app.listen(PORT, started);

module.exports = app;
