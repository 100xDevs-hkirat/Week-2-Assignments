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
const jwt= require('jsonwebtoken')
const PORT = 3000;
const app = express();

let users=[]
app.use(bodyparser.json())

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
   res.status(401).send('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token,"samplejwtsecret")
    req.user=payload
    next()
  } catch (error) {
    res.status(401).send('Authentication invalid')
  }
}


app.post('/signup',(req,res)=>{
  const { username, password,firstName,lastName } = req.body
  if(!username|| !password||!firstName||!lastName){
    res.status(400).send("Invalid Request body, make sure the required format is followed.")
  }
  if(users.find((val)=>{val.username==username})){
    res.status(400).send("Username already exists")
  }
  let input=req.body
  input.id=users.length+1
  users.push(input)
  res.status(201).send("Succesfully created User!")  
})



app.post('/login',(req,res)=>{
  let creds = req.body
  const { username, password} = req.body
  if(!username|| !password) {
    res.status(401).send("Invalid Credentials.")
  }
  
  let user= users.find((val)=>{val.username==creds.username})
  if(user.password!=creds.password){
    res.status(401).send("Invalid Credentials.")
  }
  const token = jwt.sign({user: username},"samplejwtsecret",{expiresIn: '8h'})
  let response={
    oauth_token: token,
    user_id:user.id
  }
  res.status(200).json(response)
})


app.get('/data',auth,(req,res)=> {
  console.log(req.user)
res.status(200).json(users)
})

module.exports = app;
