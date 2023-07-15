# week 2 notes and documentation

***The difference between the GET and POST methods :*** The GET method is limited to a maximum number of characters, while the POST method has no such limitation. This is because the GET method sends data through the resource URL, which is limited in length, while the POST method sends data through the HTTP message body, which has no such limitation.The post method is more secure than the Get method.
**while sending the password and the sensitive information , always use the POST method.**

## sign up

```js
    var users = [];// the identity of different users is saved in the different array .

app.use(express.json());// it is used in the beginning so that we can use the express post etc..method 
app.post("/signup", (req, res) => {// the sign up is done by implementing a callback function
  var user = req.body;//it requests the body of one user
  let userAlreadyExists = false;// let the user does not exist
  for (var i = 0; i<users.length; i++) {// they get the length of the array 
    if (users[i].email === user.email) {
        userAlreadyExists = true;
        break;
    }
  }
  if (userAlreadyExists) {
    res.sendStatus(400);
  } else {
    users.push(user);
    res.status(201).send("Signup successful");
  }
});

```

status() sets a HTTP status on the response (as a Javascript object on the server side).sendStatus() sets the status and sends it to the client
res.sendStatus(200); // equivalent to res.status(200).send('OK')
res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')

```js
   const responseBody = JSON.parse(response.body);// it means the response body should be a JSON object.
         |                               ^
      60 |     expect(responseBody.email).toBe(email);//it means the response body should  give the email address
      61 |     expect(responseBody.firstName).toBe(firstName);//it means the response body should give the first  name
      62 |     expect(responseBody.lastName).toBe(lastName);//it means the response body should give the last name

```

it should respond with the json . means the ```res.json``` .
const email = '<testuser@gmail.com>';
const password = 'testpassword';
const firstName = "kirat"
const lastName = "kirat"
In the test the above things are provided

## log in

``` js
  app.post('/login',(req, res) => {
  let user = req.body;
  let userFound = null;// let the user be empty 
  for(let i = 0; i < users.length; i++){
    if(users[i].email === user.email && users[i].password === user.password){
      userFound = users[i];
      break;

    }

  }
  if(userFound){
   res.json({
    
    firstName:userFound.firstName,
    lastName:userFound.lastName,
    email:userFound.email,
   })
   
  }
  else {
    //send msg to the client 
    res.sendStatus(401);// send msg to the client

    }

})
```

the post method is used because it is more protected and the data doesnot stick to the url like what is used in the get.

## get the data (managing the data of the users )

The third part, GET /data, aims to fetch all user's names and IDs from the server. This route is protected, which means that it can only be accessed by users who have valid credentials. To access this route, the user must provide their username and password in the headers of the request. The server will then check the username and password against the database to see if they are valid. If the username and password are valid, the server will return a 200 OK response with the protected data in JSON format. If the username and password are missing or invalid, the server will return a 401 Unauthorized response.

The protected data is an array of objects, each of which represents a user. Each object in the array has the following properties:

email: The user's email address.
firstname: The user's first name.
lastname: The user's last name.
The GET /data route is useful for retrieving a list of all users in the system. This information can be used for a variety of purposes, such as:

Managing users: The system administrator can use this information to view a list of all users in the system, and to manage their accounts.
Reporting: The system administrator can use this information to generate reports on user activity.
Security: The system administrator can use this information to identify and investigate security incidents.
The GET /data route is a powerful tool for managing users and securing the system. However, it is important to note that this route is protected, so only authorized users can access it.

``` js
  app.get("/data", (req, res) => {
  var email = req.headers.email;
  var password = req.headers.password;
  let userFound = false;
  for (var i = 0; i<users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
        userFound = true;
        break;
    }
  }

  if (userFound) {
    let usersToReturn = [];
    for (let i = 0; i<users.length; i++) {
        usersToReturn.push({
            firstName: users[i].firstName,
            lastName: users[i].lastName,
            email: users[i].email
        });
    }
    res.json({
        users
    });
  } else {
    res.sendStatus(401);
  }
});
```

By doing this, the code accumulates the user objects that pass the authentication check into the usersToReturn array. The purpose is to prepare a response that contains only the relevant user data for the authenticated user(s) who made the request.

```js
const express = require("express")
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
var users = []
app.use(express.json());
app.post('/signup',(req, res) => {
  let user = req.body;
  let userAlreadyExists = false;
  for(let i = 0; i < users.length; i++){
    if(users[i].email === user.email){
      userAlreadyExists = true;
      break;

    }

  }
  if(!userAlreadyExists){
    
    users.push(user);// push the info to the user 
    res.status(201);// send msg to the server(it is a response)
    res.send("Signup successful");}// send msg to the client (it is a response)

  else {
    //send msg to the client 
    res.sendStatus(400);// send msg to the client

    }

})

// log in part 

app.post('/login',(req, res) => {
  let user = req.body;
  let userFound = null;// let the user be empty 
  for(let i = 0; i < users.length; i++){
    if(users[i].email === user.email && users[i].password === user.password){
      userFound = users[i];
      break;

    }

  }
  if(userFound){
   res.json({
    
    firstName:userFound.firstName,
    lastName:userFound.lastName,
    email:userFound.email,
   });
   
  }
  else {
    //send msg to the client 
    res.sendStatus(401);// send msg to the client

    }

});


// 3. GET /data - Fetch all user's names and ids from the server (Protected route)
//     Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
//     The users username and password should be fetched from the headers and checked before the array is returned
//     Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
//     Example: GET http://localhost:3000/data

//its main use to collect the data from the users and then store it inside an array 

app.get('/data', (req, res) => {

  //The users username and password should be fetched from the headers and checked before the array is returned
  let email = req.headers.email;
  let password = req.headers.password;
  //let the user is not found
  let userFound = false;// false and not null because we just want to check if there is a user and then store, 
  for(let i = 0; i < users.length; i++){
    if(users[i].email === email && users[i].password === password){
      userFound = true;
      break;
    }  
    }  //The users username and password should be fetched from the headers and checked before the array is returned
    if(userFound){
      //if the user is found store the data in an empty array for the authenticated user for later use.
      let usersToReturn =[];
      for(let i = 0; i < users.length;i ++){
        usersToReturn.push({
          firstName : users[i].firstName,
          lastName : users[i].lastName,
          email : users[i].email,
           //id = users[i].id the id is not given in the test cases so the id is not needed.

        })
        //200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
        res.json({users})//it means if found give all the data of the users array in the json format .
        
      }

      }
      else {
        //send msg to the client 
        res.sendStatus(401);// send msg to the client
      
    }

  
})


module.exports = app;

```

## Get List of all files in a directory

Do you need to get all files present in the directory or you want to scan a directory for files using node.js, then you’re on the correct web page because in this Nodejs How to Tutorial, we will learning How to get the list of all files in a directory in Node.js.

We will be using Node.js fs core module to get all files in the directory, we can use following fsmethods.

```fs.readdir(path, callbackFunction)```— This method will read all files in the directory.You need to pass directory path as the first argument and in the second argument, you can any callback function.
```path.join()``` — This method of node.js path module, we will be using to get the path of the directory and This will join all given path segments together.

***The path.join() method is needed in the code above because it ensures that the path to the /files directory is correctly formed. The path.join() method takes a list of path segments as input and returns a single path that is correctly formed for the current platform.***

***For example, if the current platform is Windows, the path.join() method will ensure that the path to the /files directory uses backslashes as the path separator. If the current platform is Unix, the path.join() method will ensure that the path to the /files directory uses forward slashes as the path separator.***

***Using the path.join() method also ensures that the path to the /files directory is normalized. This means that any unnecessary path segments, such as double slashes, will be removed.***

***Without the path.join() method, it would be possible to write the path to the /files directory in a variety of ways, which could lead to errors. For example, the following code would also work, but it would not be correctly formed for Windows:***

JavaScript
```fs.readdir('./files/');```
Use code with caution. Learn more
```This code would try to read the contents of the /files/ directory, but on Windows, the /files/ directory would not exist. This is because the path separator on Windows is \, not /.```

By using the path.join() method, we can ensure that the path to the /files directory is correctly formed for the current platform and that it is normalized. This helps to prevent errors and ensures that the code is portable across different platforms.

Steps to get list of all the files in a directory in Node.js
Load all the required Nodejs Packages using “require”.
Get the path of the directory using path.join() method.
Pass the directory path and callback function in fs.readdir(path, callbackFunction) Method.
The callback function should have error handling and result handling logic.
inside callback function handle the error and run forEach on the array of files list from the directory.
Apply your logic for each file or all the files inside the forEach function.
Full code:

``` js
  //requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory 
const directoryPath = path.join(__dirname, 'Documents');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
});

```

***questions***
Yes, if you use app.get('./files', (req, res) instead of app.get('/files', (req, res), it will give an error. The app.get() method expects the first parameter to be the route path, and the ./files is not a valid route path.

The route path must start with a forward slash (/). For example, the following route paths are valid:

/files
/images/products
/api/v1/products
The following route paths are not valid:

./files
images/products
api/v1/products
If you use a route path that is not valid, Express will return a 404 error to the client. The 404 status code indicates that the requested resource was not found.

In this case, the error message will be "Not Found". This means that the server was unable to find the /files directory.

To avoid this error, you should use a valid route path, such as /files.
