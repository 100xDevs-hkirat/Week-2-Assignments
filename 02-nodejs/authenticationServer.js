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
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
let users = [];

const userSignup = (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.sendStatus(400); // User already exists
  }

  const newUser = {
    id: uuidv4(),
    email,
    password,
    firstName,
    lastName,
  };

  users.push(newUser);
  res.status(201).send('Signup successful');
};



const userLogin = (req, res) => {
  const {email, password} = req.body;
  //check whether user exists or not for login
  const isUser = users.find(user=>{
    return (user.email === email && user.password === password)
  })
  if(isUser != undefined){

    let authToken= uuidv4();
    const response = {
      email: isUser.email,
      firstName: isUser.firstName,
      lastName: isUser.lastName,
      authToken,
    };
    res.status(200).json(response);
  }else{
    res.sendStatus(401);
  }
};

const getUsers = (req, res) => {
  const email= req.headers.email;
  const password = req.headers.password;

  // check if credentials are correct

  let isUser = users.find(user =>{
    return user.email === email && user.password === password
  })
  //if correct than route will be protected via authentication of email and pass and access to get data will be given
  if(isUser!= undefined){
    let userArr = []
    users.forEach(
      user=>{
        userArr.push({
          email: user.email,
          firstName:user.firstName,
          lastName: user.lastName,
          id:user.id,
        })
      }
    )

    res.status(200).json({users:userArr})
  }else{
    res.status(401).send('Unauthorized');
  }


}; 

app.post("/signup",userSignup)
app.post("/login",userLogin)
app.get("/data",getUsers)
app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});

module.exports = app;
