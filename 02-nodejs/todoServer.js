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
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let todos = [];

app.use(bodyParser.json());
function creteId(arr) {
  if (arr.length) {
    return arr[arr.length - 1].id;
  } else {
    return 0;
  }
}

app.get("/todos", (req, res) => {
  res.status(200).send(todos);
});
app.get("/todos/:id", (req, res) => {
  const idparams = req.params["id"];
  let idTodos = todos.find((todo) => {
    return todo.id == idparams;
  });
  // console.log(idparams);
  if (idTodos == undefined) {
    return res.sendStatus(404);
  }
  // console.log(idTodos);
  res.status(200).send(idTodos);
});
app.post("/todos", (req, res) => {
  let todoTitle = req.body.title;
  let todoDescription = req.body.description;
  let id = creteId(todos);
  let todoObject = {
    id: id + 1,
    title: todoTitle,
    description: todoDescription,
  };

  todos.push(todoObject);
  // console.log(todos);
  res.status(201).json({ id: todoObject.id });
});
app.put("/todos/:id", (req, res) => {
  const idPut = req.params["id"];
  let indexOfTodo;
  let todoId = todos.find((todo, index) => {
    indexOfTodo = Number(index);
    return todo.id == idPut;
  });
  // console.log(idPut);
  if (todoId === undefined) {
    return res.sendStatus(404);
  }
  let todoTitle = req.body.title;
  let todoDescription = req.body.description;
  let todoObject = {
    id: Number(idPut),
    title: todoTitle,
    description: todoDescription,
  };
  todos[indexOfTodo] = todoObject;
  // console.log(todos);
  res.sendStatus(200);
});
app.delete("/todos/:id", (req, res) => {
  const id = req.params["id"];
  let indexDel;
  let toDele = todos.find((todo, index) => {
    todo.id === id;
    indexDel = index;
  });
  todos = todos
    .slice(0, indexDel)
    .concat(todos.slice(indexDel, todos.length - 1));
  // console.log(todos);
  res.sendStatus(200);
});
app.get("/*", (req, res) => {
  res.sendStatus(404);
});
// app.listen(3000, () => {
//   console.log("Listining in 3000");
// });
module.exports = app;
