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
    Request Body: { "title": "Buy groceries", "completed" : true }
    
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
const PORT = 3000;

app.use(bodyParser.json());

const todo = [];

const findIndex = (arr, id ) => {
  let inNum = -1;
  for (let i = 0; i < arr.length; i++) {
    if(arr[i].id == parseInt(id)){
      inNum = i;
    }    
  }
  return inNum;
}

app.delete("/todos/:id", (req,resp)=>{
  let reqId = req.params.id;
  let index = findIndex(todo, reqId)

  let deletedTodo = todo.splice(index , 1);

  for(let i = 0; i< todo.length; i++){
    todo[i].id = i + 1;
  }

  resp.status(200).json(`todo no ${index +1} is deleted`)
 
})

app.put("/todos/:id" , (req, resp)=> {
  let reqId = req.params.id;
  let index = findIndex(todo , reqId)

  if(index === -1){
    resp.status(404).json("404 NOT FOUND!")
  }else{
    todo[index].completed = true;
    resp.status(200).json(todo[index])
  }
})

app.post("/todos", (req, resp)=>{
  let data = req.body;
  let id = todo.length + 1;

  todo.push({
    id: id,
    title: data.title,
    description: data.description,
    completed: data.completed
  })

  resp.status(201).json(todo)

})

app.get("/todos", (req,resp) => {
  resp.status(200).json(todo);
})

app.get("/todos/:id", (req,resp)=> {
  const reqId = req.params.id;
  let index = findIndex(todo, reqId);

  if(index === -1){
    resp.status(404).json("404 NOT FOUND!")
  }else {
    resp.status(200).json(todo[index])
  }
})

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })

module.exports = app;
