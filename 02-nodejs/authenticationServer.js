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
const bodyParser = require('body-parser')
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json())

let USERSDATA = []

function getUser(username){
    return USERSDATA.find(user => user.username === username)
}

function signupHandler(req,res){
    let results = {success:false}
    let response = null
    try{
        const user = getUser(req.body.username)
        if(user){
            results.data = "User already exists"
            response = res.status(400).json(results)
        }else {
            const id = Date.now()
            console.log(id)
            const signupData = {...req.body, id}
            console.log(signupData)
            USERSDATA.push(signupData)
            results.success = true
            results.data = "User created successfully"
            response = res.status(200).json(results)
        }
    }catch (e) {
            results.data = e.message
            response = res.status(500).json(results)
    }
    return response
}

function loginHandler(req, res){
    let results = {success:false}
    let response = null
    try{
        const {username, password} = req.body
        const user = USERSDATA.find(user => user.username === username)
        if(user && user.password === password){
           results.success = true
           results.data = {firstName: user.firstName, lastName: user.lastName, id:user.id}
            response = res.status(200).json(results)
        }else {
            results.data = "Invalid Credentials"
            response = res.status(404).json(results)
        }
    }catch (e) {
        results.data = e.message
        response = res.status(500).json(results)
    }
    return response
}

function dataHandler(req, res){
    let results = {success:false}
    let response = null
    try{
        const {username, password} = req.headers
        const user = USERSDATA.find(user => user.username === username)
        if(!user || !(user.password === password)){
            results.success = true
            results.data = "Invalid Credentials"
            response = res.status(404).json(results)
        }else {
            const users = USERSDATA.map(user => {
                return {firstName:user.firstName, lastName:user.lastName, id: user.id}
            })
            results.data = {users}
            response = res.status(200).json(results)
        }
    }catch (e) {
        results.data = e.message
        response = res.status(500).json(results)
    }
    return response
}

app.post("/signup", signupHandler)
app.post("/login", loginHandler)
app.get("/data", dataHandler)

app.listen(3000, () => {
    console.log("Auth Server running on port 3000")
})

module.exports = app;
