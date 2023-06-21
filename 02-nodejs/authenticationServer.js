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
const { v4: uuidv4 } = require('uuid')
const PORT = 3000;
const app = express();
const jwt = require('jsonwebtoken')
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

let users = []
app.use(bodyParser.json())

app.post("/signup",(req,res)=>{
  const found = users.find(user => user.email == req.body.email)
  if (found)
    return res.sendStatus(400)
  const id = uuidv4()
  console.log(req.body.email)
  const user = {
    "id": id,
    "email": req.body.email,
    "password": req.body.password,
    "firstName": req.body.firstName,
    "lastName": req.body.lastName
  }
  users.push(user)
  res.status(201).send("Signup successful")
})

app.post("/login",(req,res)=>{
  const found = users.find( user => user.email == req.body.email)
  if(!found){
    return res.sendStatus(400)
  }
  const valid = found.password == req.body.password
  // console.log(valid)
  if(!valid){
    return res.sendStatus(401)
  }
  jwt.sign({id: found.id, email: found.email},'DFKJLSJDFSDF',{expiresIn: 60*60},(err,token)=>{
      if(err){
        res.send(500).send("internal server error")
      }
    const sendJson = {authToken :token, "firstName": found.firstName, "lastName": found.lastName, "email" : found.email}
    return res.status(200).send(sendJson)
  })
  // console.log(token)
  
})

app.get("/data",(req,res)=>{
   const found = users.find( user => user.email == req.headers.email)

   if(!found)
    return res.sendStatus(400)
  
  const valid = found.password == req.headers.password
  if(!valid){
    return res.sendStatus(401)
  }
  const sendData = users.filter(user => {
    return {firstName : user.firstName, lastName : user.lastName, id : user.id}
  })
  res.send({users:sendData})
})


app.get("*",(req,res)=>{
  res.sendStatus(404)
})

module.exports = app;

// app.listen(PORT)