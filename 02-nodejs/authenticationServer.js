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
    Description: Gets details of all users like firstname, lastname and id in an array format. 
    Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

  // write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

  // Server Boilerplate
  const express = require("express")
  const app = express();
  // const PORT = 3000;
  // app.listen(PORT, () => {
  //   console.log(`Example app listening on port ${PORT}`)
  // })

  app.use(express.json())
    
  // Global
  let users = [];
  let uniqueId = 1;

  // POST : signup
  function userSignup(req, res){
    const newUser = req.body;
    newUser.id = uniqueId++;
    let newEmail = newUser.email;
    const exists = users.findIndex( user => user.email === newEmail)
    if(exists === -1) {
      users.push(newUser)
      res.status(201).send("Signup successful")
    } else {
      res.status(400).send("Already Exists")
    }
  }

  app.post('/signup', userSignup)

  // POST : login
  function userLogin(req, res){
    const userCredentials = req.body;
    let loginEmail= userCredentials.email;
    let loginPassword = userCredentials.password;
    const exists = users.findIndex( user => ((user.email === loginEmail ) && (user.password === loginPassword)) )
    if(exists == -1){
      res.status(400).send("Wrong Credentials")
    } else {
      let detailsToSend = {...users[exists]}
      delete detailsToSend.password
      delete detailsToSend.id
      res.json(detailsToSend)
    }
  }

  app.post('/login', userLogin)

  // GET : users
  function sendUsers(req, res){
    let loginEmail = req.headers.email;
    let loginPassword = req.headers.password;
    let exists = users.findIndex(user => ((user.email === loginEmail) && (user.password === loginPassword)) )
    if(exists == -1){
      res.status(401).send("Unauthorized")
    } else {
      const usersToSend = users.map(({ password, id, ...rest }) => rest);
      res.json({users});
    }
  }

  app.get('/data', sendUsers)


  module.exports = app;
  