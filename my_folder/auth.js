// /**
//   You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
//   - Don't need to use any database to store the data.

const app = require("../02-nodejs/authenticationServer");

//   - Save the users and their signup/login data in an array in a variable
//   - You can store the passwords in plain text (as is) in the variable for now

//   The expected API endpoints are defined below,
//   1. POST /signup - User Signup
//     Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
//     Request Body: JSON object with username, password, firstName and lastName fields.
//     Response: 201 Created if successful, or 400 Bad Request if the username already exists.
//     Example: POST http://localhost:3000/signup

//   2. POST /login - User Login
//     Description: Gets user back their details like firstname, lastname and id
//     Request Body: JSON object with username and password fields.
//     Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
//     Example: POST http://localhost:3000/login

//   3. GET /data - Fetch all user's names and ids from the server (Protected route)
//     Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
//     The users username and password should be fetched from the headers and checked before the array is returned
//     Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
//     Example: GET http://localhost:3000/data

//   - For any other route not defined in the server return 404

//   Testing the server - run `npm run test-authenticationServer` command in terminal
//  */

// // Import the necessary modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt= require('jsonwebtoken');
const PORT =3000;




const users = [];

function signup(req,res){
  const { username, password, firstName, lastName } = req.body;
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send("Signup successful")
  }
  const userId = generateUniqueId();

  const newUser = {
    id: userId,
    username,
    password,
    firstName,
    lastName
  };

  users.push(newUser);
  return res.status(201).send("User Created Sucessfully");
}


function generateUniqueId() {
  const uniqueId = users.length + 1;
  return uniqueId;
}

function login(req,res){
  const user = req.body;

   user=users.find(
    user=>user.username === username && user.password ===password
    )

    if(user){
      const token =  jwt.sign({
        id :user.id ,
        username: user.username
      },'27F27A77B9AB6C2F7F197B93D5E06C84CC92B7DDD7F31353B721FB96A75CE3AE'
      );
    
    return res.status(200).json({
      id:user.id,
      firstName: user.firstName,
      lastName:user.lastName,
      token
        })
      }

      return res.status(401).json({ error: 'Invalid credentials' });

}




function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    
    return res.status(401).json({ error: 'Unauthorized' });
  }

  
  jwt.verify(token,'27F27A77B9AB6C2F7F197B93D5E06C84CC92B7DDD7F31353B721FB96A75CE3AE', (err, decoded) => {
    if (err) {
     
      return res.status(403).json({ error: 'Forbidden' });
    }

    
    const user = users.find(u => u.id === decoded.id && u.username === decoded.username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

  
    req.user = user;
    next();
  });
}


app.post('/signup', signup)

app.post('/login' ,login)

app.get('/data', authenticateToken, (req, res) => {
 
  const user = req.user;

 
  const protectedData = {
    users: users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    }))
  };
  return res.status(200).json(protectedData);
});



module.exports=app