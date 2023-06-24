/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the myusers and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows myusers to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all myusers like firstname, lastname and id in an array format. Returned object should have a key called myusers which contains the list of all myusers with their email/firstname/lastname.
    The myusers email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
app.use(express.json());
let myusers=[]
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.post("/signup",(req,res)=>{
  var reqBody=req.body;
  let userAlreadySignedUp=false;
  for(var i=0;i<myusers.length;i++){
    if(myusers[i].email===reqBody.email){
      userAlreadySignedUp=true;
    }
  }
  if(userAlreadySignedUp){
    res.status(400).send("User already exists!");
  }
  else{
    myusers.push(req.body);
    res.status(201).send("Signup successful");
  }
})

app.post("/login",(req,res)=>{
  var reqBody=req.body;
  var user;
  var i;
  for(i=0;i<myusers.length;i++){
    if(myusers[i].email===reqBody.email && myusers[i].password===reqBody.password){
      user=myusers[i];
      break;
    }
  }
  if(user){
    res.status(200).json({
      "email":myusers[i].email,
      "firstName":user.firstName,
      "lastName":user.lastName,
      "id":i
  })
  }
  else{
    res.status(401).send("Unauthorized");
  }
})

app.get("/data",(req,res)=>{
  var reqHeader=req.headers;
  var userExists=false;
  for(var i=0;i<myusers.length;i++){
    if(myusers[i].email===reqHeader.email && myusers[i].password===reqHeader.password){
      userExists=true
      break;
    }
  }
  if(userExists){
    let users=[];
    for(var i=0;i<myusers.length;i++){
      users.push({
        "firstName":myusers[i].firstName,
        "lastName":myusers[i].lastName,
        "id":i
    });
    }

    res.status(200).json({
      users
    });
  }
  else{
    res.status(401).send("Unauthorized");
  }
})

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })

module.exports = app;
