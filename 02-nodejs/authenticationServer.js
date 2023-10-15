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
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtSecret = 'YOUR_SECRET_STRING_HERE';

app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

users  = [ { "id": 1,
"username": "spande" , 
"password":"spande",
"firstname":"swanand",
"lastname":"pande"

} ,]
users = []

app.post('/signup', (req,res)=> { 

data = req.body
usernamm = data.username
userr = users.find((user)=> user.username===usernamm)
if(userr)
{
  res.send(400).json({"message": "user already exists"})
}
user = {"id" : users.length + 1 , "username": data.username , "password": data.password , "firstName": data.firstName , "lastName":data.lastName , "email":data.email};

users.push(user);

res.status(201).send('Signup successful');


})


app.post('/login',(req,res)=> { 
  dataa = req.body
  // console.log(dataa)
  // console.log(dataa.password)
  username = dataa.username
  password  = dataa.password

  // console.log(password);
  
    userr = users.find((user)=> user.username===username)
  if(userr)
  {
    if(userr.password ==password)
    {
      res.status(200).json({
        firstName: userr.firstName,
        lastName: userr.lastName,
        email: userr.email
    });

    }
    else
    {
      res.status(401).send( "Unauthorized")
    }
  }
  else
  {
    res.status(401).send( "Unauthorized")
  }



  }
 
)
app.get('/data',(req,res)=> { 

  username = req.headers.username ;
  password = req.headers.password ; 


  userr = users.find((user)=> user.username===username)


  if(userr)
  {
    if(userr.password ==password)
    {

    userss = users.map((user)=> {

      return [user.username,user.firstname,user.lastname];
    })
     res.status(200).json({"users": userss})

    }
    else
    {
      res.status(401).send( "Unauthorized")
    }
  }
  else
  {
    res.status(401).send( "Unauthorized")
  }






})
app.get('*', function(req, res){
  res.status(404).send("invalid url");
});

  // app.listen(port, () => {
  //   console.log(`Example app listening on port ${port}`)
  // })

module.exports = app;
