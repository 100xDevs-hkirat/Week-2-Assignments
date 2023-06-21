/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup -  User Signup
    Description: Allowsusers to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
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

  const express = require('express');
  const app = express();
  const PORT = 3000;
  
  // Array to store user data
  const users = [];
  
  // Middleware to parse JSON body
  app.use(express.json());
  
  // POST /signup - User Signup
  app.post('/signup', (req, res) => {
    const { username, password, firstName, lastName } = req.body;
  
    // Check if the username already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
  
    // Create a new user object
    const newUser = {
      id: generateUniqueId(),
      username,
      password,
      firstName,
      lastName,
    };
  
    // Add the new user to the array
    users.push(newUser);
  
    // Return the created user's data
    res.status(201).json(newUser);
  });
  
  // POST /login - User Login
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user with matching username and password
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
  
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Return the user's details
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });
  
  // GET /data - Fetch all user's names and ids from the server (Protected route)
  app.get('/data', (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
  
    // Check if the username and password are valid
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
  
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Return all users' names and ids
    const userData = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
  
    res.status(200).json({ users: userData });
  });
  

  
  // Helper function to generate unique IDs
  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }
  

  
  module.exports = app;
  