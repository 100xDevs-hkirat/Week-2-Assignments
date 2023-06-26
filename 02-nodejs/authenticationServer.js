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
var bodyParser=require('body-parser');
const { use } = require("./authenticationServer");

const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.json());
let userDetails=[];
app.post('/signup',(req,res)=>{
  let oneUse=req.body;
  
  let condition=true;

  for(let i=0;i<userDetails.length;i++){
    
    if(userDetails[i].email===oneUse.email){

    condition=false;
    break;
     
    }
  }
 if(condition){
  userDetails.push(oneUse);
  
  res.status(201).send("Signup successful");

 }else{
  res.status(400).send("Bad Request");
 }
  
})


app.post('/login',(req,res)=>{
  let oneUse=req.body;
  let userfound=null;
  for(let i=0;i<userDetails.length;i++){
    let userid=userDetails[i].email;
    let pd=userDetails[i].password;

    if(oneUse.email===userid && oneUse.password===pd){
      
      userfound=userDetails[i];
      break;
    }


  }
  if(userfound){
   res.json({firstName:userfound.firstName,
  lastName:userfound.lastName,
  email:userfound.email
});
    
  }else{
    res.status(401).send("invalid Credentials");
  }

})

function checkValidity(req,res,next){
   let userID=req.headers.email;
   let pd=req.headers.password;
   let validUser=false;

   for(let i=0;i<userDetails.length;i++){
      if(userDetails[i].email===userID && userDetails[i].password===pd){
        validUser=true;
        break;
      }


   }
   if(validUser){
    next();
   }else{
    res.sendStatus(401);
   }


}

app.get('/data',checkValidity,(req,res)=>{


  let ans=[];
  for(let i=0;i<userDetails.length;i++){
    ans.push({
      firstName: userDetails[i].firstName,
    lastName: userDetails[i].lastName,
  email: userDetails[i].email
    });

  }
  res.send({users:ans});

})

// app.get('/',(req,res)=>{
//   res.send("hello world")
// })

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })






module.exports = app;
