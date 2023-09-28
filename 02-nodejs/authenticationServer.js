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
  const fs = require("fs");
  const express = require("express");
  const { dirname } = require("path");
  const app = express();
  const PORT = 3000;
  const jwt = require("jsonwebtoken");
  const crypto = require("crypto");
  const port = 3000;
  
  class User {
    constructor(username, firstname, lastname, password, id) {
      (this.username = username),
        (this.firstname = firstname),
        (this.lastname = lastname),
        (this.password = password),
        (this.id = id);
    }
  }
  
  const bodyParser = require("body-parser");
  app.use(bodyParser.json());
  // write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
  
  app.post("/signup", (req, res) => {
    let UserName = req.body.username;
    var data = fs.readFileSync("b.json");
    var MyObject = JSON.parse(data);
    const Index = MyObject.findIndex((item) => item.username == UserName);
    if (Index == -1) {
      let FirstName = req.body.firstname;
      let LastName = req.body.secondname;
      let Password = req.body.password;
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const NewUser = new User(
        UserName,
        FirstName,
        LastName,
        Password,
        timestamp
      );
      var data = fs.readFileSync("b.json");
      const MyObject = JSON.parse(data);
      MyObject.push(NewUser);
  
      fs.writeFile("b.json", JSON.stringify(MyObject), function (err) {
        try {
          if (err) throw err;
          res.status(201).json({ id: timestamp });
          console.log("The post is updated");
        } catch (error) {
          res.status(400)
          console.error("there is an error", error.message);
        }
      });
    } else {
      res.status(400).send("User name already exists");
    }
  });
  
  app.get("/data", (req, res) => {
    fs.readFile("b.json", "utf-8", (err, data) => {
      try {
        if (err) throw err;
        res.status(200).sendFile(__dirname + "/b.json");
      } catch (error) {
        console.error("there is an error", error.message);
      }
    });
  });
  
  app.post("/login", (req, res) => {
    let UserName = req.body.username;
    var data = fs.readFileSync("b.json");
    var MyObject = JSON.parse(data);
    const Index = MyObject.findIndex((item) => item.username == UserName);
    if (Index != -1) {
      // Generate a random cryptographic key
      const generateSecretKey = () => {
        return crypto.randomBytes(32).toString("hex");
      };
      const secretKey = generateSecretKey();
      let FirstName = req.body.firstname;
      let LastName = req.body.secondname;
      const payload = {
        firstname: FirstName,
        lastname: LastName,
        message: "logged in success",
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
      console.log(token)
      res.status(200).json(token);
    } else {
      res.status(401).send("INVALID USER CREDENTIALS");
    }
  });
  
  app.get('*', function(req, res){
    res.send('no route found', 404);
  });
  
  
  module.exports = app;
  
  
  