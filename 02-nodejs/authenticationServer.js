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
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();
let arr=[];
var user=[];
app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

function firsttask(req,res) {
  const id = Date.now().toString();
  var obj ={
    id: id,
    username: req.body.username,
    password: req.body.password,
    email : req.body.email,
    firstName: req.body.firstname,
    lastName: req.body.lastName
    

  }
  for (var i = 0; i < arr.length; i++) {

    if (arr[i].username === (req.body.username) )
    {
      return res.status(400).send('user already exists') ;// Username exists in the array
    }
  }
  arr.push(obj);
  res.status(201).send("Signup successful");
}
function secondtask(req,res) 
  {
  const receivedEmail = req.body.email;
  const receivedPassword = req.body.password;

  const foundUser = arr.find((user) => user.email === receivedEmail && user.password === receivedPassword);

  if (foundUser) {
    const responseObj = {
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email
    };
    res.status(200).json(responseObj);
  } else {
    res.sendStatus(401);
  }
}



 function thirdtask(req,res) {

  const received_username=req.headers.email;
  const received_password=req.headers.password;
   console.log(received_username);
   console.log(received_password);
  const  index = arr.findIndex( (t) => t.email === received_username);
  
  if (index === -1){
    res.status(401).send("Unauthorized");
  }
  else{
    if(arr[index].password === received_password){
      var TobePassedobj ={
        email :  arr[index].email,
        firstName : arr[index].firstName,
        lastName: arr[index].lastName
       };
       user.push(TobePassedobj);
         return res.status(200).json({user});
    }
    res.status(401).send("Unauthorized");
  }

}

// function demofn(req,res) {
//   console.log(`Listening on port ${PORT}`);
  
// }

app.post('/signup',firsttask);
app.post('/login',secondtask);
app.get('/data',thirdtask);
//app.listen(PORT,demofn);
module.exports = app;
app.use((req, res, next) => {
  res.status(404).send();
});