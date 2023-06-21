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
const PORT = 6000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

const users = [];

// Sign up: 
app.post("/signup", (req, res) => {

  try{
    // Fetch all the data: 
    const { username, password, firstName, lastName } = req.body; 

    // Validate 
    if(!username || !password || firstName || lastName){
      return res.status(400).json({
        message: "Fill in all the fields", 
        success: false, 
      }); 
    }

    // Check if the user is present in the array or not: 
    let foundUser = null; 
    for(let i=0 ;i<users.length; ++i ){
      console.log(`user ${JSON.stringify(users[i])}`);
      if(users[i].username === username) {
        foundUser = true;
        break;
        }
      }
    if(foundUser){
      return res.status(400).json({
        message: "User with this email already exists", 
        success: false, 
      });
    }

    // Store the user in the user's array: 
    users.push({ id : Date.now(), username , password});

    // Return successful response: 
    return res.status(200).json({
      success: true, 
      message: "Signed up successfully", 
    })

  }catch(err){

    return res.status(400).json({
      message: "User could not be signed up" , 
      success: false, 
    })

  }
});

// Login 
app.post("/login", (req, res) => {
  try{
    
    // Fetch all the data: 
    const { email, password } = req.body; 

    // Validate: 
    if( !email || !password ){
      return res.status.json({
        success: false,
        message:"Please enter both fields!"
      })
    }

    // Check for given user in the users array: 
    let foundUser = users.find(user => user.email === email);    
    if(foundUser){
      // Check the password: 
      if (foundUser.password === password) {
        // Password matches, login successful
        return res.status(200).json({
          success: true,
          message: "Login successful!", 
          firstName: foundUser.firstName, 
          lastName: foundUser.lastName, 
        });
      } else {
        // Password does not match
        return res.status(401).json({
          success: false,
          message: "Invalid password!"
        });
      }
    } else {
      // User with the given email does not exist
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

  }catch(err){
    return res.status.json({
      success: false, 
      message: "An error occurred while logging in. Please try again later."
    })
  }
})

// Data: 
// Directly copied from the solutions: 
app.get("/data", (req, res) => {
  var email = req.headers.email;
  var password = req.headers.password;
  let userFound = false;
  for (var i = 0; i<users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
        userFound = true;
        break;
    }
  }

  if (userFound) {
    let usersToReturn = [];
    for (let i = 0; i<users.length; i++) {
        usersToReturn.push({
            firstName: users[i].firstName,
            lastName: users[i].lastName,
            email: users[i].email
        });
    }
    res.json({
        users
    });
  } else {
    res.sendStatus(401);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
module.exports = app;
