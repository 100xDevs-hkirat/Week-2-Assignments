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

const express = require("express");
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
var users = [];

/**
 *  The expected API endpoints are defined below,
 *   1. POST /signup - User Signup
 *     Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
 *     Request Body: JSON object with username, password, firstName and lastName fields.
 *     Response: 201 Created if successful, or 400 Bad Request if the username already exists.
 *     Example: POST http://localhost:3000/signup
 */
function userSignUp(req, res) {
    const index = getUserIndex(req.body.username);
    if(index > 0){
        res.status(400).send('Username already exists');
    }else{
        const user = {
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        const newUser = { ...user, id: this.generateId() };
        this.users.push(user);
        res.status(201).json(newUser);
    }
}

/**
 *  The expected API endpoints are defined below,
 *   2. POST /login - User Login
 *     Description: Gets user back their details like firstname, lastname and id
 *     Request Body: JSON object with username and password fields.
 *     Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
 *     Example: POST http://localhost:3000/login
 */
function userLogin(req, res) {
    const index = getUserIndex(req.body.username);
    if(index > 0){
        const user = {
            username: req.body.username,
            password: req.body.password
        };
        const resultUser = this.users[index]
        if(resultUser.password === user.password){
            resultUser.authToke = "test";
        }else{
            res.status(401).send('Invalid Credentials');
        }
        const newUser = { ...user, id: this.generateId() };
        this.users.push(user);
        res.status(201).json(newUser);

    }else{
        res.status(404).send('Username does not exists');
    }
}

function getUserIndex(inputUsername) {
    return this.users.findIndex(function (user) {
        return user.username === inputUsername
    });
}

function clear() {
    this.users = [];
}

function generateId() {
    const timestamp = new Date().getTime();
    const randomId = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomId}`;
}











app.post('/signup', userSignUp);


function started() {
    console.log(`Example app listening on port ${port}`);
}

app.listen(port, started);

// for all other routes, return 404
app.use((req, res, next) => {
    res.status(404).send();
});
module.exports = app;
module.exports = app;
