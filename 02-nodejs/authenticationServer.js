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
  var bodyParser = require('body-parser')
  var jwt = require('jsonwebtoken')
  var JWT_SECRET = 'secret';
  const PORT = 3000;
  const app = express();
  // write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
  app.use(bodyParser.json());
  
  var counter = 0;
  var users = [];
  app.post('/signup', function(req,res){
  
    if(req.body.email && req.body.password && req.body.firstName && req.body.lastName){
      var userAlreadyExists=0;
      users.forEach((v,i,a)=>{
        if(v.username==req.body.username){
          userAlreadyExists=1;
        }
      });
      if(userAlreadyExists){
        res.status(400).send('Username already exists');
      }
      else{
        counter++;
        newObj={};
        newObj['userId']=counter;
        newObj['email']=req.body.email;
        newObj['password']=req.body.password;
        newObj['firstName']=req.body.firstName;
        newObj['lastName']=req.body.lastName;
        users.push(newObj);
        res.status(201).send('Signup successful');
      }
      
    }
    else{
      res.status(400).send('Insufficient parameters supplied');
    }
  
  });
  
  app.post('/login', function(req,res){
  
    var userIndex=-1;
  
    for(var i=0; i<users.length; i++){
      if(users[i].email==req.body.email){
        userIndex=i;
        break;
      }
    }
  
    if( (userIndex==-1) || (users[userIndex].password!=req.body.password) ){
      res.status(404).send('Invalid credentials');
    }
    else{
      const token = jwt.sign({id:users[userIndex].userId}, JWT_SECRET);
      res.send({email:users[userIndex].email, firstName:users[userIndex].firstName, lastName:users[userIndex].lastName, authToken:token});
    }
    
  });
  
  app.get('/data', function(req,res){
    for(var i=0; i<users.length; i++){
      if((users[i].email==req.headers.email) && (users[i].password==req.headers.password)){
        res.send({users});
        return;
      }
    }
    res.status(401).send('Unauthorized');
  
  });
  
  //app.listen(3000, ()=>{console.log('Server running on port 3000')});
  
  module.exports = app;
  