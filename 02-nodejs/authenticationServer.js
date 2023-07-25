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
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
var users = []
app.use(express.json());
app.post('/signup',(req, res) => {
  let user = req.body;
  let userAlreadyExists = false;
  for(let i = 0; i < users.length; i++){
    if(users[i].email === user.email){
      userAlreadyExists = true;
      break;

    }

  }
  if(!userAlreadyExists){
    
    users.push(user);// push the info to the user 
    res.status(201);// send msg to the server(it is a response)
    res.send("Signup successful");}// send msg to the client (it is a response)

  else {
    //send msg to the client 
    res.sendStatus(400);// send msg to the client

    }

})

// log in part 

app.post('/login',(req, res) => {
  let user = req.body;
  let userFound = null;// let the user be empty 
  for(let i = 0; i < users.length; i++){
    if(users[i].email === user.email && users[i].password === user.password){
      userFound = users[i];
      break;

    }

  }
  if(userFound){
   res.json({
    
    firstName:userFound.firstName,
    lastName:userFound.lastName,
    email:userFound.email,
   });
   
  }
  else {
    //send msg to the client 
    res.sendStatus(401);// send msg to the client

    }

});
// 3. GET /data - Fetch all user's names and ids from the server (Protected route)
//     Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
//     The users username and password should be fetched from the headers and checked before the array is returned
//     Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
//     Example: GET http://localhost:3000/data

//its main use to collect the data from the users and then store it inside an array 

app.get('/data', (req, res) => {

  //The users username and password should be fetched from the headers and checked before the array is returned
  let email = req.headers.email;
  let password = req.headers.password;
  //let the user is not found
  let userFound = false;// false and not null because we just want to check if there is a user and then store, 
  for(let i = 0; i < users.length; i++){
    if(users[i].email === email && users[i].password === password){
      userFound = true;
      break;
    }  
    }  //The users username and password should be fetched from the headers and checked before the array is returned
    if(userFound){
      //if the user is found store the data in an empty array for the authenticated user for later use.
      let usersToReturn =[];
      for(let i = 0; i < users.length;i ++){
        usersToReturn.push({
          firstName : users[i].firstName,
          lastName : users[i].lastName,
          email : users[i].email,
           //id = users[i].id the id is not given in the test cases so the id is not needed.

        })
        //200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
        res.json({users})//it means if found give all the data of the users array in the json format .
        
      }

      }
      else {
        //send msg to the client 
        res.sendStatus(401);// send msg to the client
      
    }

  
})

  
  
  module.exports = app;
  