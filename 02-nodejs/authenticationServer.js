/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now*/
const express = require("express")
const app = express();
const USERS = [];
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

 /* The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup*/
    app.post('/signup', function(req, res){
      const username = req.body.username;
      const password = req.body.password;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const id = USERS.length + 1;
      if(USERS.find(user => user.username === username)){
        res.status(400).send('Bad Request');
      }
      else{
      USERS.push({"username":username, "password":password, "firstName":firstName, "lastName":lastName, "id":id});
      res.status(201).send('Signup successful');
    }})

  /*2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login*/
    app.post('/login', function(req, res){
      const username = req.body.username;
      const password = req.body.password;
      const user = USERS.find(user => user.username === username && user.password === password);
      if(user){
        jwt.sign({username,password},'R1811', function(err, token){
          if(err){
            res.status(401).send('Unauthorized');
          }else{
            res.status(200).json({"token":token});
          }
        })
      }
      else{
        res.status(401).send('Unauthorized');
      }
    })
    

  /*3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data*/
    app.get("/data", (req, res) => {
      var username = req.headers.username;
      var password = req.headers.password;
      let userFound = false;
      for (var i = 0; i<USERS.length; i++) {
        if (USERS[i].username === username && USERS[i].password === password) {
            userFound = true;
            break;
        }
      }
    
      if (userFound) {
        let usersToReturn = [];
        for (let i = 0; i<USERS.length; i++) {
            usersToReturn.push({
                firstName: USERS[i].firstName,
                lastName: USERS[i].lastName,
                id: USERS[i].id
            });
        }
        res.json({
            users: usersToReturn
        });
      } else {
        res.sendStatus(401);
      }
    });

  //- For any other route not defined in the server return 404

 // Testing the server - run `npm run test-authenticationServer` command in terminal


// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;
