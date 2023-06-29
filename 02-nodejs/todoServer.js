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

let todos = [];
// { id: 1, title: "Sample todo 1", description: "", completed: false },
// { id: 2, title: "Sample todo 2", description: "", completed: false },

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const PORT = 4000;

const app = express();
app.use(writeToFileMiddleware);
app.use(bodyParser.json());

const getTodo = (req, res) => res.status(201).send(todos);

function writeToFileMiddleware(req, res, next) {
  let oldSend = res.send;
  res.send = function (data) {
    fs.readFile("todoServer.txt", "utf8", (err, data) => {
      const dataArr = JSON.parse(data);
      if (err) return;
      console.log("File read data: ", data);
      if (data?.length) todos = dataArr;
    });

    fs.writeFile(
      "todoServer.txt",
      JSON.stringify(data),
      (err) => err && console.log(err)
    );
    res.send = oldSend;
    return res.send(data);
  };
  next();
}

const getTodoById = (req, res) => {
  const todo = todos.filter((t) => t.id === Number(req.params.id))[0];
  todo
    ? res.status(200).send(todo)
    : res.status(404).send({ error: "Invalid ID for todo" });
};

const postTodo = (req, res) => {
  const { title, completed = false, description = "" } = req.body;
  const id = Date.now();
  if (!title)
    return res.status(400).send({ error: "Cannot add an empty todo" });
  todos.push({ id, title, description, completed });
  res.status(201).send({ id });
};

const updateTodo = (req, res) => {
  const id = Number(req.params.id);
  const currTodo = todos.reduce(
    (acc, curr, idx) => (curr.id === id ? (acc = [curr, idx]) : acc),
    [false, false]
  );

  if (!currTodo[0])
    return res.status(400).send({ error: "Invalid ID to update todo" });
  const {
    title = currTodo[0].title,
    description = currTodo[0].description,
    completed = currTodo[0].completed,
  } = req.body;
  todos.splice(currTodo[1], 1, { title, description, completed });
  res.status(200).send({ message: `Updated todo with id: ${id}` });
};

const deleteTodo = (req, res) => {
  const { id } = req.params;
  const idx = todos.map((t) => t.id).indexOf(Number(id));
  if (idx < 0) return res.status(400).send({ error: "Invalid ID" });
  todos.splice(idx, 1);
  res.status(200).send({ message: `Successfully deleted ID: ${id}` });
};

app.get("/todos", getTodo);
app.get("/todos/:id", getTodoById);
app.post("/todos", postTodo);
app.put("/todos/:id", updateTodo);
app.delete("/todos/:id", deleteTodo);

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
module.exports = app;
