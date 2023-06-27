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
const bodyParser = require('body-parser');
const {ulid} = require("ulid");
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());

let users = [];
let userIndex = {};
let index = 0;

class User {
    constructor(firstName, lastName, email, password) {
        this.id = ulid();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    getUser() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };
    }
}


const generateSecretKey = () => {
    return require('crypto').randomBytes(128).toString('hex');
};

const secretKey = generateSecretKey();

app.post('/signup', (req, res) => {
    if (req.body.email in userIndex)
        return res.status(400).json({error: `${req.body.email} already exists`});
    const user = new User(req.body.firstName, req.body.lastName, req.body.email, req.body.password).getUser();
    users.push(user);
    userIndex[user.email] = index;
    index += 1;
    return res.status(201).send(`Signup successful`);
});


app.post('/login', (req, res) => {
    if (!(req.body.email in userIndex))
        return res.send(400).send(`${req.body.email} does not exist`);
    const index = userIndex[req.body.email];
    const userDetails = users[index];
    if (req.body.password !== userDetails.password)
        return res.status(401).send(`Unauthorized`);
    return res.json({
        authToken: jwt.sign(userDetails.email, secretKey),
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
    });
});


app.get('/data', (req, res) => {
    const {email, password} = req.headers;
    if (!(email in userIndex))
        return res.status(401).send(`Unauthorized`);
    const index = userIndex[email];
    const userDetails = users[index];
    if (password !== userDetails.password)
        return res.status(401).send(`Unauthorized`);
    return res.json({users: users});
});

app.use((req, res) => {
    return res.status(400).send(`Route not found`);
});

module.exports = app;
