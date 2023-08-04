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
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
const path = "db.json";

let currentId = 1;
function FindLength()
{
  data = fs.readFile(path, 'utf8', (err, data)=>{
    const database = JSON.parse(data);
    return database.length > 0 ? database.length : 1;
  });
}
currentId = FindLength();

function readData()
{
  const data = fs.readFileSync(path, 'utf8');
  return JSON.parse(data);
}
function writeData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function create(req, res) {
  console.log(currentId);
  const newItem = {
    id: currentId,
    title: req.body.title,
    completed: req.body.title || false,
    description: req.body.description || ''
  };

  fs.readFile(path, 'utf8', (err, data)=>{
    if(err) throw err;
    const database = JSON.parse(data);
    database.push(newItem);
    fs.writeFile(path, JSON.stringify(database), (err)=>{
      if(err) throw err;
      currentId++;
      res.status(201).json({
        'id': currentId-1});
    });
  });
}

function getAll(req, res) {
  fs.readFile(path, 'utf8', (err, data) => {
    if(err) throw err;
    res.json(JSON.parse(data));
  });
}

function getOne(req, res) {
  const database = readData();
  const id = parseInt(req.params.id);
  const present = database.find((item) => item.id === id);
  if(present)
  {
    res.json(present);
  }
  res.status(404).send();
}

function deleteOne(req, res) {
  const database = readData();
  const id = parseInt(req.params.id);
  const present = database.find((item) => item.id === id);
  if(present)
  {
    const databaseNew = database.filter((item) => item.id !== id);
    writeData(databaseNew);
    res.send();
  }
  res.status(404).send();
}

function deleteAll(req, res) {
  writeData('');
}

function edit(req, res) {
  const database = readData();
  const idx = parseInt(req.params.id);
  const present =  database.find(item => item.id === idx);
  if(present)
  {
    present.title = req.body.title || present.title;
    present.completed = req.body.completed || present.completed,
    present.description = req.body.description || present.completed

    writeData(database);
    res.send();
  }
  res.status(404).send();
}

app.get("/todos", getAll);
app.get("/todos/:id", getOne);
app.post("/todos", create);
app.put("/todos/:id", edit);
app.delete("/todos/:id", deleteOne);
app.delete('/todos/all', deleteAll);

// export default app;
module.exports = app;
// app.listen(3000, () => {
//   console.log("listening");
// });
