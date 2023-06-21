/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with email, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the email already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with email and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users email and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the email and password in headers are valid, or 401 Unauthorized if the email and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(express.json());

const creds = [];
const loggedInUsers = [];
const secret = "aca123321";

const encrypt = (msg) => {
    const encrypted = CryptoJS.AES.encrypt(msg, secret);
    return encrypted;
};

const decrypt = (encrypted) => {
    const decrypted = CryptoJS.AES.decrypt(encrypted, secret);
    return decrypted;
};

const getNewToken = (cred) => {
    return cred.email;
    const d = new Date();
    const expiresAt = new Date().setMinutes(d.getMinutes() + 1);
    const tokenInput = `${expiresAt}||${cred.email}||${cred.password}`;
    const token = encrypt(tokenInput);
    return token;
};

const getTokenData = (token) => {
    const decryptedToken = decrypt(token);
    const [expiresAt, email, password] = decryptedToken.split("||");
    return {
        email,
        password,
        isExpired: expiresAt >= new Date().getTime(),
    };
};

// app.use((req, res) => {
//     console.log("request body:", req.body);
//     console.log("request header:", req.headers);
// });

const addNewUser = (req, res) => {
    const userData = req.body;
    const email = userData.email;
    if (creds.find((cred) => cred.email === email) === undefined) {
        creds.push(userData);
        res.status(201).send("Signup successful");
    } else {
        res.status(400).send("email already exists");
    }
};
app.post("/signup", addNewUser);

const login = (req, res) => {
    const inputCred = req.body;
    const actualCred = creds.find((cred) => cred.email === inputCred.email);
    if (actualCred === undefined) {
        res.status(400).send("User with such email not found");
    } else {
        if (actualCred.password === inputCred.password) {
            // const token = getNewToken(inputCred);
            const { password, ...creds } = actualCred;
            res.status(200).send(creds);
        } else {
            res.status(401).send("Unauthorized");
        }
    }
};
app.post("/login", login);

const getAllCreds = (req, res) => {
    const inputCred = req.headers;
    const actualCred = creds.find((cred) => cred.email === inputCred.email);
    if (actualCred === undefined) {
        res.status(400).send("User with such email not found");
    } else {
        if (actualCred.password === inputCred.password) {
            res.send({
                users: creds.map((cred) => {
                    const { password, ...c } = cred;
                    return c;
                }),
            });
        }
        res.status(401).send("Unauthorized");
    }
};
app.get("/data", getAllCreds);

app.use((req, res) => {
    res.status(404).send("Route not found");
});

// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });

module.exports = app;
