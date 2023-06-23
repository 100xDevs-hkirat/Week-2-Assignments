const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

const app = express();

app.use(bodyParser.json());

const readData = (fileName) => {
    const data = fs.readFileSync(path.join(__dirname, './files/', fileName), "utf-8");
    if(data.length) return JSON.parse(data);
    else return [];
}

const writeFile = (fileName, data) => {
    fs.writeFileSync(path.join(__dirname, './files/', fileName), JSON.stringify(data), "utf-8");
}

const getAllTodos = (req, res) => {
    let todos = readData('todos.json');
    res.json(todos);
  }
  
  const getTodo = (req, res) => {
    let todoId = req.params.id;
    let todos = readData('todos.json');
    let todoIndex = todos.findIndex((el) => el.id == todoId);
  
    if(todoIndex >= 0) {
      res.status(200).json(todos[todoIndex]);
    } else {
      res.status(404).send("Not Found");
    }
  }
  
  const addTodo = (req, res) => {
    let todo = req.body;
    let uId = Math.floor((Math.random())*100000 + 1);

    let todos = readData('todos.json');
  
    todos.push({...todo, id: uId});

    writeFile('todos.json', todos);
  
    res.status(201).json({id: uId});
  
  }
  
  const updateTodo = (req, res) => {
    let todoId = req.params.id;
    let updatedBody = req.body;

    let todos = readData('todos.json');
  
    let todoIndex = todos.findIndex((el) => el.id == todoId);
  
    if(todoIndex >= 0) {
      todos[todoIndex] = {...todos[todoIndex], ...updatedBody};
      writeFile('todos.json', todos);
      res.status(200).send("Item was found and updated");
    } else {
      res.status(404).send("Not Found");
    }
  
  }
  
  const deleteTodo = (req, res) => {
    let todoId = req.params.id;
    let todos = readData('todos.json');
  
    let todoIndex = todos.findIndex((el) => el.id == todoId);
  
    if(todoIndex >= 0) {
      todos.splice(todoIndex, 1);
      writeFile('todos.json', todos);
      res.status(200).send("Item was found and deleted");
    } else {
      res.status(404).send("Not Found");
    }
  
  }

app.get('/todos', getAllTodos);
app.get('/todos/:id', getTodo);
app.post('/todos', addTodo);
app.put('/todos/:id', updateTodo);
app.delete('/todos/:id', deleteTodo);

app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

module.exports = app;