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
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server



// 1st signup server...!!
const users=[];
app.post('/signup',(req,res)=>{
   // var details=req.body;
     var findinguser=req.body;
     var isexit=users.find(user=> user.email===findinguser.email);
     if(isexit){
      res.status(400).send("The username already exits...!");
     }
     else{
      const dels={email:findinguser.email,password:findinguser.password,firstName:findinguser.firstName,lastName:findinguser.lastName};
      users.push(dels);//how to generate the unique id?
      res.status(201).send("Signup successful");
     }
})

// 2nd login server

app.post('/login',(req,res)=>{
      
      var formuser=req.body;
      var isexit=null;
      for(let i=0;i<users.length;i++){
        if( users[i].email===formuser.email && users[i].password===formuser.password){
          isexit=users[i];break;
        }
      }
      if(isexit){
       res.json({email:isexit.email,firstName:isexit.firstName,lastName:isexit.lastName});
      }
      else{
        res.status(401).send("user not found");
      }
    
})

// 3rd getting /data
app.get('/data',(req,res)=>{
     var usermail=req.headers.email;
     var userpass=req.headers.password;
     var detail=[];
     var validing=false;
     for(let i=0;i<users.length;i++){
         if(users[i].email===usermail && users[i].password===userpass){
          validing=true;
         }
         detail.push({
           firstName:users[i].firstName,
           lastName:users[i].lastName,
           email:users[i].email
         });
     }
     if(validing){
      res.status(200).json({users});
     }
     else{
      res.status(401).send("Unauthorized");
     }
})
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
module.exports = app;
