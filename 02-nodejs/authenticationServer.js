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
const fs = require("fs")
const bodyParser = require("body-parser")
const uuid = require("uuid")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json())

app.post("/signup", (req, res) => {
  fs.readFile("./files/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({data: "Not able to open the Users file."})
    } else {
      let users = JSON.parse(data)
      let email = req.body.email
      if (users[email]) {
        res.status(400).json({data: "User already exists."})
      } else {
        let user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
          id: uuid.v4()
        }
        users[email] = user

        fs.writeFile("./files/users.json", JSON.stringify(users), (err) => {
          if (err) {
            res.status(500).json({data: "Not able to open the Users file."})
          } else {
            // res.status(201).json({...user, email})
            res.status(201).json({data: "Signup successful"})
          }
        })
      }
    }
  })
})

app.post("/login", (req, res) => {
  fs.readFile("./files/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({data: "Not able to open the Users file."})
    } else {
      let users = JSON.parse(data)
      let email = req.body.email
      if (users[email]) {
        if (users[email].password !== req.body.password) {
          res.status(401).json({data: "Unauthorized"})
        } else {
          res.json({data: {
            firstName: users[email].firstName,
            lastName: users[email].lastName,
            id: users[email].id
          }})
        }
      } else {
        res.status(404).json({data: "User not found."})
      }
    }
  })
})

app.get("/data", (req, res) => {
  fs.readFile("./files/users.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({data: "Not able to open the Users file."})
    } else {
      let users = JSON.parse(data)
      let email = req.headers.email
      if (users[email]) {
        if (users[email].password !== req.headers.password) {
          res.status(401).json({data: "Unauthorized"})
        } else {
          let toReturn = []
          for (const [key, value] of Object.entries(users)) {
            toReturn.push({
              email: key,
              firstName: value.firstName,
              lastName: value.lastName,
              id: value.id
            })
          }
          res.json(toReturn)
        }
      } else {
        res.status(404).json({data: "User not found."})
      }
    }
  })
})

// app.listen(3000)

module.exports = app;
