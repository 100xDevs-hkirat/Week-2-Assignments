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
  const bodyParser=require("body-parser");
  
  //middleware
  app.use(bodyParser.json());
  
  let user=[];
  
  function userSignup(req,res){
    let userDetails=req.body;
    let emailCheck=req.body.email;
    let emailExist=false;
    for(let i=0;i<user.length;i++){
      if(user[i].email===emailCheck){
        emailExist=true;
        break;
      }
    }
    if(emailExist){
      res.status(400).send("Bad Request");
    }
    else{
      let userData={
        id:Date.now().toString(16)+Math.random().toString(16).slice(2),
        firstName:userDetails.firstName,
        lastName:userDetails.lastName,
        email:userDetails.email,
        password:userDetails.password,
      }
      user.push(userData);
      res.status(201).send("Signup successful");
    }
  }
  
  function userLogin(req,res){
    let email=req.body.email;
    let password=req.body.password;
    let userDetails;
    let validated=false;
    for(let i=0;i<user.length;i++){
      if(user[i].email===email&&user[i].password===password){
  
        validated=true;
        userDetails={firstName:user[i].firstName,lastName:user[i].lastName,email:user[i].email};
        break;
      } 
    }
    if(validated){
      res.status(200).json(userDetails);
    }
    else{
      res.status(401).send("Unauthorized");
    }
  }
  
  function getUserData(req,res){
    let password=req.headers.password;
    let email=req.headers.email;
    let validated=false;
    for(let i=0;i<user.length;i++){
      if(user[i].email===email&&user[i].password===password) validated=true;
    }
    if(validated){
      let userDetails=[];
      for(let i=0;i<user.length;i++){
        let userData={
          id:user[i].id,
          firstName:user[i].firstName,
          lastName:user[i].lastName,
        }
        userDetails.push(userData);
      }
      res.status(200).json({users:userDetails});
    }
    else{
      res.status(401).send("Unauthorized");
    }
  }
  
  app.post('/signup',userSignup);
  app.post('/login',userLogin);
  app.get('/data',getUserData);
  