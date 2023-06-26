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
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json());

const USERS = [];

async function authenticationMiddleware(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = USERS.find((user) => user.email === email);

    if (existingUser && bcrypt.compareSync(password, existingUser.password)) {
        req.token = await bcrypt.genSalt(10);
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

app.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const existingUser = USERS.find((user) => user.email === email);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = uuidv4();

    const newUser = {
        userId:userId,
        email:email,
        password:hashedPassword,
        firstName:firstName,
        lastName:lastName
    };

    if(!existingUser){
        USERS.push(newUser);
        res.status(201).send('Signup successful');
    }else{
        res.status(400).send("User Already Exists, please try logging in");
    }
});

app.post('/login', authenticationMiddleware, (req, res) => {
    const email = req.body.email;
    const existingUser = USERS.find((user) => user.email === email);

    res.status(200).json({
        userId: existingUser.userId,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        token: req.token
    });
});

app.get('/data', authenticationMiddleware,(req, res) => {
    const usersList = []
    for(let users of USERS){
        usersList.push(users);
    }
    res.status(200).send(usersList);
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});



module.exports = app;
