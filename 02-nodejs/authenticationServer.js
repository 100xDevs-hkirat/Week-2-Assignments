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
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3001;
const app = express();
const { v4: uuidv4 } = require("uuid");


const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let USER = [];


app.post("/signup", (req, res) => {
 const {email,password,firstName,lastName} = req.body

 console.log(req.body);
 console.log(req.body.email);
 console.log(req.body.password);


 let existingUser = USER.find(user => user.email);

  if (existingUser) {
    console.log(email);
    res.status(400).send("user already exist")
    return;
  } 
  if(!email || !password || !firstName || !lastName){
    res.status(401).send("everything in the field required")
    return;
  }
const id = uuidv4();
    USER.push({email,password,firstName,lastName,id});
    console.log(USER)
    res.status(201).send("Signup successful");
  
})



app.post("/login", (req, res) => {
  const {email,password} = req.body
 
  console.log(req.body);
  console.log(req.body.email);
  console.log(req.body.password);
 
  if(!email || !password){
    res.status(401).send("unauthorized")
    return;
  }

  const existingUser = USER.find(
    user => user.email === email && user.password === password
  );

  if (existingUser) {
    res.status(200).json({
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName
    });
  } else {
    res.status(401).send("Invalid credentials");
  }
})

app.get("/data", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).send("Unauthorized");
    return;
  }

  const existingUser = USER.find(
    (user) => user.email === email && user.password === password
  );

  if (existingUser) {
    const users = USER.map(({ id, firstName, lastName }) => ({
      id,
      firstName,
      lastName,
    }));

    res.status(200).json({ users });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

 
 


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

module.exports = app;
