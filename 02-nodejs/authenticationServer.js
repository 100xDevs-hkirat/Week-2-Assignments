/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstName, lastName and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstName, lastName and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstName/lastName.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
let userDataArr = [];

function doesUserExists(email) {
  return userDataArr.filter(userData =>
    userData.email === email
  );
}
function getUserData(email, password) {
  return userDataArr.filter(userData =>
    userData.email === email && userData.password === password
  );
}
function getAllUsersData() {
  let userArr = [];
  userDataArr.forEach(user => {
    userArr.push({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id
    });
  });
 return userArr;
}
function signup(req, res) {
  let body = req.body;
  const email = req.body.email;
  body["id"] = userDataArr.length + 1;
  const userAccount = doesUserExists(email);
  if (userAccount.length != 0) {
    return res.status(401).send("Bad Request");
  }
  userDataArr.push(req.body);
  return res.status(201).send("Signup successful");
}
app.post('/signup', signup);

function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserData(email, password);
  if (user.length == 0) {
    return res.status(401).send("Unauthorized");
  }
  const userData = {
    "email": email,
    "firstName": user[0].firstName,
    "lastName": user[0].lastName
  }
  // console.log(user, " ", userData);
  res.status(200).send(userData);
}
app.post('/login', login);


function getData(req, res) {
  const email = req.headers.email;
  const password = req.headers.password;
  const user = getUserData(email, password);
  
  if (user.length === 0) {
    return res.status(401).send("Unauthorized");
  }
  
  let usersArr = [];
  user.forEach(userData => {
    usersArr.push({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      id: userData.id
    });
  });
  
  return res.json({ users: usersArr });
}

app.get('/data', getData);
// app.listen(PORT, ()=>{
//   console.log('app listening...')
// })

app.use((req, res) => {
  res.status(404).send('Route not found');
});
module.exports = app;
