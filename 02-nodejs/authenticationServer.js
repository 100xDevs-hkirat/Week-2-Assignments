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
  var bod = require('body-parser')
  app.use(bod.json());
  var people = []
  var id = 1000
  
  function signup(req,res){
      var det = req.body;
      det["id"] = id
      
      console.log(id)
      for (let i = 0; i < people.length; i++){
          if(people[i].email == det.email){
              res.status(400).send("User already exits")
          }
      }
      people.push(det)
      id = id+1
      res.status(201).send("Signup successful")
  }
  
  function login(req,res){
      var det = req.body
      for(var i =0;i<people.length;i++){
          if(det["email"] == people[i].email && det["password"] == people[i].password){
              res.json({
                  firstName: people[i].firstName,
                  lastName: people[i].lastName,
                  email: people[i].email
              })
          }
      }
  
      res.sendStatus(401)
  }
  
  function dataa(req,res){
      var email = req.headers.email
      var pass = req.headers.password
      var isa = false
      for(var i =0;i<people.length;i++){
          if(email === people[i].email && pass === people[i].password){
                  isa = true
                  break
          }
      }
      if(isa === false){
          res.status(401).send("Unauthorized")
          return
      }
      var result = []
      for(var i=0;i<people.length;i++){
          result.push({
              firstName: people[i].firstName,
              lastName: people[i].lastName,
              email: people[i].email
          })
      }
      res.status(200).json({users:result})
  }
  app.post("/signup",signup)
  app.post("/login",login)
  app.get("/data",dataa)
  function started(){
      console.log("starteddd")
  }
  //app.listen(3000,started)
  
  
  module.exports = app;
  
