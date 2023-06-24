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
const PORT = 3010;
const app = express();
// write your logic here, DON'T WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

module.exports = app;
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let isAdminUser = false;
const USERS = [];

const {v4: uuidv4} = require('uuid');

function generateUniqueId() {
    return uuidv4();
}

//This check whether the logged in user is an admin user or not
app.use((req, res, next) => {
    let email;
    let password;
    if (req.headers.email)
        email = req.headers.email;
    if (req.headers.password)
        password = req.headers.password;
    if (IsValidCredententials(email, password)) {
        isAdminUser = true;
    }
    next();
});

function IsValidCredententials(email, password) {
    for (const user of USERS) {
        if (user.email === email && user.password === password) {
            return true;
        }
    }
    return false;
}

app.post("/signup", (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    const isExistingUser = USERS.find(user=>user.email===email);
    if (isExistingUser) {
        res.status(400).send("Bad Request");
    } else {
        const uniqueId = generateUniqueId();
        USERS.push({email: email, password: password, firstName: firstName, lastName: lastName, id: uniqueId});
        res.status(201).send("Signup successful");
        console.log(USERS);
    }
});

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    let userFound = false;
    for (const user of USERS) {
        if (user.email === email && user.password === password) {
            userFound = true;
            res.send({email: email, firstName: user.firstName, lastName: user.lastName, authToken: generateUniqueId()});
        }
    }
    if (!userFound)
        res.status(401).send("Unauthorized");
});

app.get("/data", (req, res) => {
    if (isAdminUser) {
        const users = USERS.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }));
        isAdminUser = !isAdminUser;
        res.send({users: users});
    } else {
        res.status(401).send("Unauthorized");
    }
});

app.all("*",(req, res)=>{
    res.status(404).send("Route Not found");
})

