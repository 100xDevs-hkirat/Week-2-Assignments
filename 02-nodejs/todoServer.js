/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let todos = new Array;
let id = 1;


app.get('/todos',(req,res)=>{
  res.status(200).send(todos);
})

//doubt :- what is differenct bewteen req, request, what is necessary to pass in the function param
app.get('/todos/:id',(req,res)=>{
  for ( var i = 0 ; i < todos.length; ++i ){
    if ( todos.at(i).id == req.params.id ){
      res.status(200).send(todos.at(i));
      return;
    }
  }
  res.status(404).send('Todo not found');
})

app.post('/todos',(req,res)=>{
  var title = req.body.title;
  var description = req.body.description;

  var todo = {
    id : id,
    title : title,
    description : description,
    completed : false
  }
  
  id++;
  todos.push(todo);
  res.status(201).send({id:todo.id});
})

app.delete('/todos/:id',(req,res)=>{
  for ( var i = 0 ; i < todos.length; ++i ){
    if ( todos.at(i).id == req.params.id ){
      todos.splice(i,1);
      res.status(200).send('Todo deleted');
      return;
    }
  }
  res.status(404).send('Todo not found');
})

app.put('/todos/:id',(req,res)=>{
  for ( var i = 0 ; i < todos.length ; ++i ){
    if ( todos.at(i).id == req.params.id ){
      var description = req.body.description;
      var title = req.body.title;
      var completed = req.body.completed;

      if ( title != null) todos.at(i).title = title;
      if ( description != null ) todos.at(i).description = description;
      if ( completed != null ) todos.at(i).completed = completed;
      res.status(200).send('Updated the todo');
      return;   
    }
  }
  res.status(404).send('todo not found');
})

app.use((req,res)=>{
  res.status(404).send("invalid route");
})

//app.listen(3000,()=>(console.log("started listening on 3000")));

module.exports = app;

