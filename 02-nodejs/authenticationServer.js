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

const bodyParser = require('body-parser');
const express = require('express');
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.json());

const AUTH_TOKEN_LENGTH = 32;
// index will be treated as id
const datastore = { users: [] };
class User {
  constructor({ email, password, firstName, lastName }) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

const generateAuthToken = function (length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};

app.post('/signup', (req, res) => {
  const userData = req.body;
  if (datastore.users.some((user) => user.email === userData.email))
    return res
      .status(400)
      .send(`User with username ${userData.email} already exists`);

  const user = new User(userData);
  datastore.users.push(user);
  res.status(201).send('Signup successful');
});

app.post('/login', (req, res) => {
  const userAuth = req.body;
  const dbUser = datastore.users.find((user) => user.email === userAuth.email);
  if (!dbUser) return res.status(401).send('User does not exists');

  if (dbUser.password !== userAuth.password)
    return res.status(401).send('Invalid password');

  const { email, firstName, lastName } = dbUser;

  const authToken = generateAuthToken(AUTH_TOKEN_LENGTH);
  const successfulLoginResponse = { email, firstName, lastName, authToken };

  res.status(200).json(successfulLoginResponse);
});

app.get('/data', (req, res) => {
  const { email, password } = req.headers;

  const user = datastore.users.find((user) => user.email === email);
  console.log(user);
  if (!user) return res.sendStatus(401);
  if (user.password !== password) return res.sendStatus(401);

  const allUsers = {
    users: datastore.users.map((dbUser) => ({
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
    })),
  };
  res.status(200).json(allUsers);
});

app.use((_, res) => res.status(404).send('Endpoint not found'));

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
module.exports = app;
