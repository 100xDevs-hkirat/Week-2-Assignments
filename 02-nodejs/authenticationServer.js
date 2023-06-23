/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server


/*
   POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup
*/
let users =[]
let id = 1;


function getUserByemail(email){
    for(let u in users){
        const user = users[u];
        if(user.email === email){
          return user;
        }
    }
}

app.post('/signup',function(req,res){
    let body = req.body
    const user = getUserByemail(body.email);
    
    if(user){
      res.sendStatus(400)
    }else{
      const newUser = {}
      newUser.id = id++;
      newUser.email = body.email;
      newUser.password = body.password;
      newUser.firstName = body.firstName;
      newUser.lastName = body.lastName;
      users.push(newUser);
      res.status(201).send('Signup successful')  
    }  
})
/* POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login
 */

app.post('/login',function(req,res){
    let body = req.body
    const user = getUserByemail(body.email);

    if(user && user.password === body.password){
      res.status(200).json(user)
    }else{
      res.sendStatus(401)
    }
})

/*GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data
 */

app.get('/data',function(req,res){
    const email = req.headers.email;
    const password = req.headers.password;
    const user = getUserByemail(email)
    if(user && user.password === password){
       res.json({'users':users})
    }else{
      res.sendStatus(401)
    }
})

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app;
