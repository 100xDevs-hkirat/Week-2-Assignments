/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/files',(req,res)=>{// get accepts only the root path therefore ./ will create a problem
  fs.readdir(path.join(__dirname,'./files/'),(err,files)=>{// path .join uses the current working directory
    if(err) {
      //if there is an error on the server send the status code 500 and also send the json to the client saying {"er :failed to retrive the files }
      return res.status(500).json({ error: 'Failed to retrieve files' });
       // what to return is not specified in the test case therfore .send( 'Failed to retrieve files' ) sending it as a string is also applicable.
    }
    
    //if there is no error on the server send the status code 200 and also send the json to the client saying {"files":files}
    res.status(200).json({'files':files})
    
  });

});
// 2. GET /file/:filename - Returns content of given file by name
//      Description: Use the filename from the request path parameter to read the file from `./files/` directory
//      Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found

// there are generally two ways of getting the file : first get the file one by one it will be a longer code ,second access the file dynamically.
//for the dynamic access you need the req.params
app.get("/file/:filename",(req, res) => {// get access the root path and ":" says the next file should be dynamic.
  // note : it is file , which is totally different from the "files" that is given in the folder .
  fs.readFile(path.join(__dirname,'./files/',req.params.filename),(err,data)=>{
    // it says to read the files from the path (which is dynamically configured in the path .join )
    if(err) {
      
      return res.status(404).send("File not found");//sendStatus id displayed to the client, it sends a string it is displayed in the payload .
      // the res.sendStatus(404) by default returns the " Not Found" to the client,then the >send("kljvk") is useless.

    }

    
    //if there is no error on the server send the status code 200 and also send the json to the client saying {"files":files}
    res.status(200).send(data)//.status is for the server,it send the data as a payload.
    // do not write the {data}.. do not pass the data as a object or a json payload like .send.json. it shoould return the things as it is .

    
  });

})
// this is a by default condition when the route is not proper.
// there is no difference between the app.all("*",fn) and tha app.use(fn)..
// if you intend to insert some middleware that runs for all routes or runs for all routes that are descended from some path, then use app.use(). Personally, I would only use app.all(path, fn) if I wanted a handler to be run only for a specific path no matter what the method was and I didn't not want it to also run for paths that contain this path at the start. I see no practical reason to ever use app.all('*', fn) over app.use(fn).

app.use((req,res)=>{
  // if no route is found
  res.status(404).send("Route not found");

})




module.exports = app;
