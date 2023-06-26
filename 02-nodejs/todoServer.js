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

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const DATA_FILE = path.join(__dirname, 'files', 'data.json');

app.use(bodyParser.json());

// Middleware to handle bodyParser errors
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send('Bad Request');
  } else {
    next();
  }
})

function generateId() {
  return Math.random().toString(36).slice(2);
}

function findById(id, todos) {
  return todos.find(record => record.id === id);
}

function readToDoList() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function addToDo(todoItem, todoList) {
  return new Promise((resolve, reject) => {
    const id = generateId();
    todoItem.id = id;
    todoList.push(todoItem);

    fs.writeFile(DATA_FILE, JSON.stringify(todoList), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        const objId = { id: todoItem.id };

        resolve(objId);
      }
    });
  });
}

function updateToDo(id, body, todoList) {
  return new Promise((resolve, reject) => {
    const itemIndex = todoList.findIndex(record => record.id === id);
    let todoItem = todoList[itemIndex];

    if (todoItem) {
      Object.assign(todoItem, body);
      todoList[itemIndex] = todoItem;

      fs.writeFile(DATA_FILE, JSON.stringify(todoList), 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(todoItem);
        }
      });
    } else {
      resolve(todoItem);
    }
  });
}

function deleteToDo(id, todoList) {
  return new Promise((resolve, reject) => {
    const itemIndex = todoList.findIndex(record => record.id === id);

    if (itemIndex === -1) {
      resolve(itemIndex);
    } else {
      todoList.splice(itemIndex, 1);

      fs.writeFile(DATA_FILE, JSON.stringify(todoList), 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(itemIndex);
        }
      });
    }
  })
}

function parseData(jsonData) {
  return new Promise((resolve, reject) => {
    try {
      const parsedData = JSON.parse(jsonData);

      resolve(parsedData);
    } catch (error) {
      reject(error);
    }
  });
}

// Get a list of todos
app.get('/todos', (req, res) => {
  readToDoList()
  .then(parseData)
  .then(parsedDataObject => {
    res.status(200).json(parsedDataObject);
  })
  .catch(error => {
    res.status(500).send("Couldn't read the list due to an internal server error");
  });
});

// Add a new todo item in todo list
app.post('/todos/', (req, res) => {
  const todoBody = req.body;

  readToDoList()
    .then(parseData)
    .then(parsedDataObject => {
      const todos = parsedDataObject;

      addToDo(todoBody, todos)
        .then(objId => {
          res.status(201).json(objId);
        })
        .catch(error => {
          res.status(500).send("Couldn't save to disk due to an internal server error");
        });
    })
    .catch(error => {
      res.status(500).send("Couldn't read the list due to an internal server error");
    });
});

// Fetch todo item
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  readToDoList()
    .then(parseData)
    .then(parsedDataObject => {
      const todo = findById(id, parsedDataObject);

      if (todo) {
        res.status(200).json(todo);
      } else {
        res.status(404).send('Todo not found');
      }
    })
    .catch(error => {
      res.status(500).send("Couldn't read the list due to an internal server error");
    });
});

// Update todo item
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const todoBody = req.body;

  readToDoList()
    .then(parseData)
    .then(parsedDataObject => {
      const todos = parsedDataObject;

      updateToDo(id, todoBody, todos)
        .then(todo => {
          if (todo) {
            res.status(200).json(todo);
          } else {
            res.status(404).send('Todo not found');
          }
        })
        .catch(error => {
          res.status(500).send("Couldn't save to disk due to an internal server error");
        });
    })
    .catch(error => {
      res.status(500).send("Couldn't read the list due to an internal server error");
    });
});

// Delete todo item
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  readToDoList()
    .then(parseData)
    .then(parsedDataObject => {
      const todos = parsedDataObject;

      deleteToDo(id, todos)
        .then(indexTodo => {
          if (indexTodo === -1) {
            res.status(404).send('Todo not found');
          } else {
            res.status(200).send('Todo deleted successfully.');
          }
        })
        .catch(error => {
          res.status(500).send("Couldn't save to disk due to an internal server error");
        });
    })
    .catch(error => {
      res.status(500).send("Couldn't read the list due to an internal server error");
    });
});

// Any other route is not found
app.use('*', (req, res) => {
  res.status(404).send('Route not found');
});

module.exports = app;
