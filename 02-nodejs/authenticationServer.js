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
const bodyParser = require("body-parser");
const fs = require("fs");
const PORT = 3000;
const app = express();
let id;

app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

function fetchLastUserId(callback) {
  fs.readFile("signup.txt", "utf-8", (err, fileContent) => {
    if (err) {
      console.error("Error reading file:", err);
      callback(err, null);
      return;
    }

    const lines = fileContent.trim().split("\n");

    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];

      if (lastLine === 0) {
        callback(null, null);
      }
      try {
        const lastRecord = JSON.parse(lastLine);

        const lastRecordId = lastRecord.id;
        callback(null, lastRecordId);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        callback(parseError, null);
      }
    }
  });
}

function checkAlreadyExists(userInfo, callback) {
  console.log("Exists or not");
  let exists = false;

  fs.readFile("signup.txt", "utf-8", (err, userData) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
      return;
    }
    const lines = userData.trim().split("\n");

    lines.forEach((line) => {
      const user = JSON.parse(line);

      if (userInfo.username === user.username) {
        console.log("Exists");
        exists = true;
      } else {
        console.log("Not Exists");
        exists = false;
      }
    });
    callback(exists);
  });
}

//signup
function signup(req, res) {
  const userSignupData = req.body;

  checkAlreadyExists(userSignupData, (exists) => {
    if (exists) {
      console.log("Username already exists");
      res.status(401).send("Username already exists");
    } else {
      if (id === null) {
        userSignupData.id = 1;
      } else {
        userSignupData.id = id++;
      }
      const dataToWrite = JSON.stringify(userSignupData);

      fs.appendFile("signup.txt", dataToWrite + "\n", (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          res.status(500).send("Error writing to file");
        } else {
          console.log("Written Successfully");
          res.status(201).send("success");
        }
      });
    }
  });
}

//login
function login(req, res) {
  console.log("Login");
  const { username, password } = req.body;

  fs.readFile("signup.txt", "utf-8", (err, userData) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
      return;
    }

    const lines = userData.trim().split("\n");

    let isLoginSuccessful = false;

    lines.forEach((line) => {
      try {
        const user = JSON.parse(line);

        if (user.username === username && user.password === password) {
          isLoginSuccessful = true;
          return;
        }
      } catch (parseError) {
        console.log("Error parsing JSON:", parseError);
      }
    });

    if (isLoginSuccessful) {
      res.status(200).send("Login Successful");
    } else {
      res.status(401).send("Invalid Username or password");
    }
  });
}

app.post("/login", login);
app.post("/signup", signup);
app.listen(PORT, () => {
  console.log("Server is running on http://localhost: " + PORT);

  fetchLastUserId((err, lastUserId) => {
    if (err) {
      console.error("Error:", err);
      return;
    }
    if (lastUserId === null) {
      id = 1;
    } else if (lastUserId !== null) {
      id = lastUserId + 1;
      console.log("ID of the last user:", lastUserId);
    } else {
      console.log("No records in the file.");
    }
  });
});

module.exports = app;
