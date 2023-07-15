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

``` js
  path.join(__dirname,'./files/',req.params.filename),(err,data)

  // it says to dynamically access the parameters which is inside the get method (route path ) and the __dirname is necessary if someone is configured this in a different machine it will automatically get the path and the ./files is used to get the current directory path .


```

res.status(200).json({'files':files}) does this send the json to the client or the server ?

The res.status(200).json({'files':files}) code sends the JSON to the client. The res object is an object that is used to send the response to the client. The status() method sets the status code of the response. The json() method sends the JSON data to the client.

In this case, the status code is set to 200, which indicates that the request was successful. The JSON data is the object {'files':files}. This object contains an array of files.

The JSON data is sent to the client in the body of the response. The client can then parse the JSON data and use it as needed.

So, to answer your question, the res.status(200).json({'files':files}) code sends the JSON to the client, not the server.

## then what is the difference between the res.send() and res.sendStatus()

The res.send() and res.sendStatus() methods are both used to send a response to the client. However, there are some key differences between the two methods.

The res.send() method sends the data to the client, and then it ends the response. The res.sendStatus() method also sends the data to the client, but it does not end the response. Instead, it sets the status code of the response.

This means that the res.sendStatus() method can be used to send a response with an error status code. For example, the following code sends a response with an error status code of 404:

res.sendStatus(404);
The res.send() method cannot be used to send a response with an error status code.

Another difference between the two methods is that the res.send() method can be used to send any type of data, while the res.sendStatus() method can only be used to send strings.

This means that the res.send() method can be used to send JSON data, while the res.sendStatus() method cannot.

In general, the res.sendStatus() method should be used to send responses with error status codes, while the res.send() method should be used to send other types of responses.

Here is a table that summarizes the differences between the two methods:

Method Description
res.send() Sends the data to the client, and then it ends the response.
res.sendStatus() Sends the data to the client, and it sets the status code of the response.
Can be used to send Any type of data
Should be used for Sending responses with error status codes
I hope this explanation is helpful. Let me know if you have any other questions.

## then what is the difference between the res.status() and res.sendStatus()

The res.status() and res.sendStatus() methods are both used to set the status code of the response. However, there are some key differences between the two methods.

The res.status() method only sets the status code of the response. It does not send any data to the client. The res.sendStatus() method also sets the status code of the response, but it also sends the status code as a string to the client.

This means that the res.status() method is more efficient, as it does not send any unnecessary data to the client. However, the res.sendStatus() method can be useful if you want to send the status code to the client in the body of the response.

Here is a table that summarizes the differences between the two methods:

Method Description
res.status() Sets the status code of the response. Does not send any data.
res.sendStatus() Sets the status code of the response, and sends the status code as a string to the client.
Efficiency More efficient
Sending status code to client Does not send status code to client
In general, the res.status() method should be used if you only need to set the status code of the response. The res.sendStatus() method should be used if you also need to send the status code to the client in the body of the response.

I hope this explanation is helpful. Let me know if you have any other questions.

## why do we need to set an error code

There are several reasons why we need to set an error code.

To help developers debug errors. When an error occurs, the error code can help developers debug the error by providing more information about the nature of the error. For example, the error code can indicate the type of error that occurred, the line of code where the error occurred, and the value of the variable that caused the error.
To help users understand the error. When an error occurs, the error code can help users understand the error by providing a brief description of the error. This can help users to troubleshoot the error and to find a solution.
To comply with industry standards. Some industry standards, such as HTTP, require that error codes be set for certain types of errors. This is to ensure that all applications that conform to the standard will return the same error codes for the same types of errors.
In general, it is a good practice to set an error code for any type of error that can occur in your application. This will help developers and users to debug and troubleshoot errors, and it will also help your application to conform to industry standards.

Here are some of the benefits of setting an error code:

Improved debugging: Error codes can help developers to debug errors by providing more information about the nature of the error. This can save time and effort, and it can help to prevent future errors from occurring.
Better user experience: Error codes can help users to understand the error that has occurred, and they can also provide instructions on how to troubleshoot the error. This can improve the user experience and reduce the number of support tickets that are generated.
Compliance with standards: Some industry standards, such as HTTP, require that error codes be set for certain types of errors. This ensures that all applications that conform to the standard will return the same error codes for the same types of errors.
I hope this helps! Let me know if you have other questions.

## explain the res.status().send.json({})

The res.status().send.json({}) code is used to send a response with an error status code and a JSON payload. The res object is an object that is used to send the response to the client. The status() method sets the status code of the response. The send() method sends the data to the client. The json() method sends the JSON data to the client.

In this case, the status code is set to 400, which indicates that the request was invalid. The JSON payload is the empty object {}. This object will be sent to the client as JSON data.

The res.status().send.json({}) code can be used to send a response with an error status code and a JSON payload for any type of error. For example, the following code sends a response with an error status code of 404 if the file that is requested does not exist:

```js
const filepath = path.join(__dirname, './files/', req.params.filename);

if (!fs.existsSync(filepath)) {
  res.status(404).send.json({ error: 'File not found' });
}
```

The res.status().send.json({}) code is a concise and efficient way to send a response with an error status code and a JSON payload.

Here is a breakdown of the code:

res.status(400) sets the status code of the response to 400.
res.send() sends the data to the client.
res.json() sends the JSON data to the client.
{} is an empty object.
I hope this explanation is helpful. Let me know if you have any other questions.

## what is a payload

1
In computing and telecommunications, a payload is the part of transmitted data that is the actual intended message. Headers and metadata are sent only to enable payload delivery. In the context of a computer virus or worm, the payload is the portion of the malware which performs malicious action.

In the context of APIs, a payload is the data that is sent to the API endpoint. The payload can be in any format, such as JSON, XML, or plain text. The API endpoint will then process the payload and return a response.

For example, the following code sends a payload to an API endpoint:

```js
const payload = {
  name: 'John Doe',
  age: 30,
};

const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  body: JSON.stringify(payload),
});
```

The payload in this example is a JSON object that contains the user's name and age. The fetch() method will send the payload to the API endpoint, and the API endpoint will then process the payload and return a response.

The payload is an important part of APIs, as it is the data that is used to interact with the API. The format of the payload will vary depending on the API, but the payload is always the data that is sent to the API endpoint.

Sources
en.wikipedia.org/wiki/Payload_(computing)
Search related topics

## The res.status().send.json({}) code can be used to send a response with an error status code and a JSON payload for any type of error.  what is the payload in this context

The payload in the context of the code res.status().send.json({}) is the empty object {}. This object is sent to the client as JSON data.

The res.status() method sets the status code of the response to 400, which indicates that the request was invalid. The res.send() method sends the data to the client. The res.json() method sends the JSON data to the client.

The empty object {} can be used to represent any type of error. For example, if the request was invalid because the user did not provide a valid username, the payload could be an object with the following properties:

{
  error: 'Invalid username',
}
The error property would contain a brief description of the error. The payload could also include other properties, such as the line of code where the error occurred, the value of the variable that caused the error, and the stack trace.

The payload is an important part of the response, as it provides information about the error that occurred. This information can be used by the client to troubleshoot the error and to find a solution.

## does the .send () send a pay load ?

Yes, the .send() method can send a payload. The payload can be any type of data, such as a string, an object, or an array. The payload is sent to the client as the body of the response.

For example, the following code sends a string payload to the client:

res.send('Hello, world!');
The res.send() method will send the string Hello, world! to the client as the body of the response.

The payload can also be an object or an array. For example, the following code sends an object payload to the client:

``` js
const payload = {
  name: 'John Doe',
  age: 30,
};
```

res.send(payload);
The res.send() method will send the object payload to the client as the body of the response.

The payload can also be an array. For example, the following code sends an array payload to the client:

const payload = ['Hello, world!', 'This is a payload'];

res.send(payload);
The res.send() method will send the array payload to the client as the body of the response.

The payload is an important part of the response, as it contains the data that is sent to the client. The format of the payload will vary depending on the application, but the payload is always the data that is sent to the client.

## res.status(200).send(data) does it send the data as a payload

Yes, the res.status(200).send(data) code sends the data as a payload. The res object is an object that is used to send the response to the client. The status() method sets the status code of the response. The send() method sends the data to the client.

In this case, the status code is set to 200, which indicates that the request was successful. The data is the object data. This object will be sent to the client as the body of the response.

The res.status(200).send(data) code can be used to send any type of data as a payload. For example, the following code sends a string payload to the client:

res.status(200).send('Hello, world!');
The res.status(200).send(data) code will send the string Hello, world! to the client as the body of the response.

The payload can also be an object or an array. For example, the following code sends an object payload to the client:

``` js
const payload = {
  name: 'John Doe',
  age: 30,
};
```

## payload

res.status(200).send(payload);
The res.status(200).send(data) code will send the object payload to the client as the body of the response.

The payload can also be an array. For example, the following code sends an array payload to the client:

const payload = ['Hello, world!', 'This is a payload'];

res.status(200).send(payload);
The res.status(200).send(data) code will send the array payload to the client as the body of the response.

The payload is an important part of the response, as it contains the data that is sent to the client. The format of the payload will vary depending on the application, but the payload is always the data that is sent to the client.

## does the 404 status code send the "Not Found by default " if i write the res.sendStatus(404) ?

Yes, the 404 status code sends the "Not Found" message by default if you write res.sendStatus(404). The res.sendStatus() method sets the status code of the response to 404, which indicates that the resource that was requested was not found. The sendStatus() method also sends the status code as a string to the client.

The following code sends a 404 status code and the "Not Found" message to the client:

res.sendStatus(404);
The res.sendStatus(404) code will send the following response to the client:

HTTP/1.1 404 Not Found
Content-Length: 0
The Content-Length header indicates that the response has no content. The response body will be empty.

The "Not Found" message is not sent as a separate message. It is sent as the body of the response.

If you want to send a custom message with the 404 status code, you can use the res.json() method. The res.json() method sends the JSON data to the client. The following code sends a 404 status code and a custom message to the client:

``` js
res.json({
  error: 'Resource not found',
});
```

The res.json() code will send the following response to the client:

HTTP/1.1 404 Not Found
Content-Type: application/json
Content-Length: 17

``` js
{
  "error": "Resource not found"
}

```

The Content-Type header indicates that the response is in JSON format. The Content-Length header indicates that the response has 17 bytes of content. The response body will contain the JSON object { error: "Resource not found" }.

## difference between app.all('*') VS app.use(function)?

```app.all('*', function(req, res, next) {```
vs

```app.use(function (req, res, next) {```
Whats the difference? doesn't both take in each request to the server?

For the wildcard ```*``` path, there's really not much of a meaningful difference at all. It appears to me like the internal implementation may be slightly more efficient for ```app.use(fn)```, then ```app.all('*', fn)```. And, if you intend for it to run on all routes, then app.use() makes more logical sense to me since what you're really doing is middleware and that's what app.use() is specially designed for.

Summary for app.all('*', fn) vs. app.use(fn):

No difference in order of execution.
app.use() fires regardless of methods, app.all() only fires for parser supported methods (probably not relevant since the node.js http parser supports all expected methods).
Summary for app.all('/test', fn) vs. app.use('/test', fn):

No difference in order of execution
app.use() fires regardless of methods, app.all() only fires for parser supported methods (probably not relevant since the node.js http parser supports all expected methods).
app.use() fires for all paths that start with /test include /test/1/ or /test/otherpath/more/1. app.all() only fires if its an exact match to the requested url.x
Details

All route handlers or middleware that match a given route are executed in the order they were defined so app.all('*', fn) and app.use(fn) do not have any different ordering when placed in identical places in the code.

In looking at the Express code for app.all() it appears that the way it works is that it just goes through all the HTTP methods that the locally installed HTTP parser supports and registers a handler for them. So, for example, if you did:

app.all('*', fn);
The Express code would run these:

app.get('*', fn);
app.put('*', fn);
app.post('*', fn);
app.delete('*', fn);
// ...etc...
Whereas app.use() is method independent. There would be only one handler in the app router's stack that is called no matter what the method is. So, even if an unsupported http verb was issued and the parser let the request get this far, the app.use() handler would still apply whereas the app.all() handler would not.

If you use a path with both app.all() and app.use() that is not just a simple wildcard like '*', then there is a meaningful difference between the two.

app.all(path, fn) only triggers when the requested path matches the path here in its entirety.

app.use(path, fn) trigger when the start of the requested path matches the path here.

So, if you have:

app.all('/test', fn1);     // route 1
app.use('/test', fn2);     // route 2
And, you issue a request to:

<http://yourhost.com/test>         // both route1 and route2 will match
<http://yourhost.com/test/1>       // only route2 will match
Because only middleware with app.use() fires for partial matches where the requested URL is contains more path segments beyond what is specified here.

So, if you intend to insert some middleware that runs for all routes or runs for all routes that are descended from some path, then use app.use(). Personally, I would only use app.all(path, fn) if I wanted a handler to be run only for a specific path no matter what the method was and I didn't not want it to also run for paths that contain this path at the start. I see no practical reason to ever use app.all('*', fn) over app.use(fn).
