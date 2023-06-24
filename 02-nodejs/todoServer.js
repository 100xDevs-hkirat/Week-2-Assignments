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
const port = 3000;
app.use(bodyParser.json());

let listOfTodos = [];

//Seed In-memory database of Todos.
// let listOfTodos = [
//   { id: 1, title: "grocery", descrpition: "buy milk" },
//   { id: 2, title: "study", descrpition: "javascript lesson 2" },
// ];

function retrieveAllTodos(req, res) {
  try {
    let serializedTodos = JSON.stringify(listOfTodos);
    let obj = JSON.parse(serializedTodos);
    res.send(obj);
  } catch (err) {
    res.status(500).send("JSON conversion failed in server. Try again.");
  }
}

function retrieveATodo(req, res) {
  let id = parseInt(req.param("id"));
  let matchedTodo = {};
  if (!listOfTodos.length) {
    res.status(404).json("ToDo List is empty.");
    return;
  }

  listOfTodos.forEach((todo) => {
    if (todo.id === id) {
      matchedTodo = todo;
    }
  });

  if (Object.hasOwn(matchedTodo, "title")) {
    res.json(matchedTodo);
    return;
  } else {
    res.status(404).json(`Todo ID: ${id} not found.`);
    return;
  }
}

function createTodo(req, res) {
  todoObjectToCreate = req.body;
  if (
    Object.hasOwn(todoObjectToCreate, "title") &&
    Object.hasOwn(todoObjectToCreate, "description") &&
    Object.hasOwn(todoObjectToCreate, "completed")
  ) {
    todoObjectToCreate.id = Date.now();
    listOfTodos.push(todoObjectToCreate);
    res.status(201).json(`{id:${todoObjectToCreate.id}}`);
  } else {
    console.log(typeof todoObjectToCreate);
    res
      .status(404)
      .send(
        `Could NOT create todo ${JSON.stringify(
          req.body
        )}. Does it have title, description & completed properties as required?`
      );
  }
}

function updateATodo(req, res) {
  let id = parseInt(req.param("id"));
  if (isNaN(id)) {
    res.status(404).send("Invalid ID: It is a number.");
  }
  let todoToBeUpdated = null;
  let indexofMatchFound = -1;
  listOfTodos.forEach((todo, index) => {
    if (todo.id === id) {
      todoToBeUpdated = todo;
      indexofMatchFound = index;
    }
  });

  if (!todoToBeUpdated) {
    res.status(404).send(`Given Todo ID '${id}' NOT found.`);
  }

  if (
    Object.hasOwn(req.body, "title") ||
    Object.hasOwn(req.body, "description") ||
    Object.hasOwn(req.body, "completed")
  ) {
    propertiesToUpdate = Object.keys(req.body);
    propertiesToUpdate.forEach((updateProperty) => {
      todoToBeUpdated[updateProperty] = req.body[updateProperty];
    });
    listOfTodos[indexofMatchFound] = todoToBeUpdated;
    res.status(200).send("Todo updated.");
  } else {
    res
      .status(400)
      .send(
        "Bad request: Only title, description or completed property can be updated."
      );
  }
}

function deleteATodo(req, res) {
  let idToDelete = parseInt(req.params.id);
  if (isNaN(idToDelete)) {
    res.status(400).send(`Bad request`);
    return;
  }

  listOfTodos.forEach((todo, indexToDelete) => {
    if (todo.id === idToDelete) {
      listOfTodos.splice(indexToDelete, 1);
      res.status(200).send(`Todo ID ${idToDelete} deleted.`);
      return;
    }
  });

  res.status(404).send(`No todo with ID ${idToDelete} found.`);
}

app.get("/todos", retrieveAllTodos);
app.get("/todos/:id", retrieveATodo);
app.post("/todos", createTodo);
app.put("/todos/:id", updateATodo);
app.delete("/todos/:id", deleteATodo);

app.listen(port, () => {
  console.log(`Server @ ${port}`);
});

module.exports = app;
