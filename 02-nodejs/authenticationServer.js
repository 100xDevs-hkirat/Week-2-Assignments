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
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object
     should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid,
     or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const port = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var userData = [];
app.use(express.json());

app.post('/signup',(request, response)=>{

  console.log("in post signup");
  var data = request.body;

  console.log(data.email);
  console.log(data.password);
  console.log(data.firstName);
  var obj = {
    id : userData.length + 1, 
    email : data.email,
    password : data.password,
    firstName : data.firstName,
    lastName : data.lastName,
  }
  var len = userData.length;
  if(len === 0){
    userData.push(obj);
    response.status(201).send("Signup successful");
    return;
  }
  else{
    for(var i=0;i<userData.length;i++){
      if(userData[i].email === data.email){

        response.status(400).send(" username already exists");
      }
    }
  }
  userData.push(obj);
  response.status(201).send("Signup successful");
});

app.post('/login',(request, response)=>{

  console.log("User Login");

  var data = request.body;
  var username = data.email;
  var password = data.password;

  console.log(username, password);
  console.log(userData.length);

  for(var i=0; i<userData.length; i++){

    console.log(userData[i].email,userData[i].password)

    if(username === userData[i].email && password === userData[i].password){

      const responseBody = {
        email: userData[i].email,
        firstName: userData[i].firstName,
        lastName: userData[i].lastName,
      };
        response.status(200).json(responseBody);
        return;
    }
    else{
        response.status(401).send("Unauthorized");
    }

  }
response.status(401).send("Unauthorized");
});



app.get('/data',(request, response)=>{
  var data = request.headers;
  console.log(data);
  username = data.email;
  password = data.password;

  var len = userData.length;
  var userFound = false;

  for(var i=0;i<len;i++){
    if(userData[i].email === username && userData[i].password === password){
      userFound = true;
      break;
    }
  }

  if(userFound){
    let sol = [];
    for (let i = 0; i<userData.length; i++) {
        var obj = {
            firstName: userData[i].firstName,
            lastName: userData[i].lastName,
            email: userData[i].email
        };
        sol.push(obj);
    }
    response.status(200).json({ users: sol });

  }
  else{
    response.status(401).send("Unauthorized");
  }

  
})

app.use(function(req, res, next) {
  res.status(404).send('Not Found');
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app;
