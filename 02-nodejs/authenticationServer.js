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

const express = require("express");
const { request } = require("http");
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const usersData = [{ id : 12345678 , username : "abhi4u" , password : "adhvheww" ,firstname : "abhimanyu" ,lastname :"2233" , email:"@gmial.com"}]

// user = { id : "" , username : " " , password : "" ,firstname : "" ,lastname :"""}

function newId(){
  return Math.floor(Math.random() * 100000000)
}

app.get('/data',(req,res)=>{
  
  const {email , password} = req.headers 
  let isValid = false;

  for (let i = 0; i < usersData.length; i++) {
    if(email === usersData[i].email && password === usersData[i].password){
         isValid = true;
         break;
    }  
  }

  if(isValid) res.status(200).send(usersData)

  else res.status(401).send("Unauthorized")


})

app.post("/signup",(req,res)=>{
     const userId = newId();

     const {username, password ,firstname ,lastname ,email} = req.body
     if(usersData.length > 0){
      for (let i = 0; i <= usersData.length-1; i++) {
        if(username === usersData[i].username){
             res.sendStatus(400)
        }
       }
      }
    
     if(username && password && firstname && lastname && email){
      usersData.push({id : userId ,username : username, email : email , password : password, firstname : firstname , lastname : lastname})
         res.status(201).send("Signup successful")
     }
     else{
      res.sendStatus(400)
     }

})

app.post("/login",(req,res)=>{

  const {username , password} = req.body

  let isExist = false;

  for(let i = 0 ; i < usersData.length ; i++) {
    
    if(usersData[i].username === username && usersData[i].password === password){
      isExist = true;
      break;
    }  
  }

  if(isExist) {res.json({firstname : usersData[i].firstname, lastname : usersData[i].lastname , id : usersData[i].id})}

  else {res.sendStatus(401)}
})

app.all('*',(req,res)=>{
  res.sendStatus(404)
})

module.exports = app;
