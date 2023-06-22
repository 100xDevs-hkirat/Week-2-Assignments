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
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
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
app.use(bodyParser.json())
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
let data = []
let uid = 1
// /email, password, firstName and lastName fields.
app.post('/signup' , (req, res)=>{

  exist= false
  
  for(let i = 0  ; i< data.length ; i++)
  {
    if(data[i].email===req.body.email)
    exist = true 
  }

  if(exist)
  {
    res.status(404).send()
  }

  else
  {
    id = uid 
    uid++
    data.push({id :id , email:req.body.email , password :req.body.password , firstName : req.body.firstName , lastName : req.body.lastName })
    res.status(201).send('Signup successful')
  }
})

// 2. POST /login - User Login
// Description: Gets user back their details like firstname, lastname and id
// Request Body: JSON object with email and password fields.
// Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
// Example: POST http://localhost:3000/login

app.post('/login',(req, res)=>{
  exist = false
  user = ''
  for(let i = 0  ; i< data.length ; i++)
  {
    if(data[i].email === req.body.email && data[i].password === req.body.password)
    {
      exist = true  
      user = data[i]

    }
  }

  if(!exist)
  {
    res.status(401).send()
  }

  else
  {
    res.status(200).json({firstName:user.firstName , lastName: user.lastName , email : user.email })
  }
})



// 3. GET /data - Fetch all user's names and ids from the server (Protected route)
// Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
// The users email and password should be fetched from the headers and checked before the array is returned
// Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
// Example: GET http://localhost:3000/data


app.get('/data' , (req, res)=>{

  username = req.headers.username
  password =  req.headers.password

  let check = false

  for(let i = 0 ; i< data.length ; i++)
  {
    if(username=== data[i].username && password === data[i].password)
    {
      check  =true 
    }

  }

  if(!check)
    {
      res.status(401).send('Unauthorized')
    }

    else
    {
      let arr = []

      for(let i =  0 ; i<data.length ; i++)
      arr.push({id : data[i].id , email: data[i].email , firstName : data[i].firstName , lastName : data[i].lastName})

      res.status(200).json({users : arr})
    }

})


app.use((req ,res ,next) =>{
  res.status(404).send('Route not found')
})



// app.listen(3000)
module.exports = app;
