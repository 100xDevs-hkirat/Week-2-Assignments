const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();

app.use(bodyParser.json());
let todos = [];
let uniqueId = 1;

function loadFromFile() {
    fs.readFile("todo.json", "utf8", (err, data) => {
        if (err) throw err;
        else {
            todos = JSON.parse(data);
        }
    })
}

function writeToFile() {
    fs.writeFile("todo.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
    })
}


app.get('/todos', (req, res) => {
    loadFromFile();
    console.table(todos);
    res.status(200).json(todos);
})

app.get('/todos/:id', (req, res) => {
    loadFromFile();
    const todo = todos.find(todo => todo.id === parseInt(req.params.id));
    if (todo) {
        console.table(todos);
        res.status(200).json(todo);
    } else {
        res.status(404).send("Todo not found");
    }
})

app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    const newTodo = { id: uniqueId, title, description };
    uniqueId++;
    todos.push(newTodo);
    console.table(todos);
    writeToFile();
    res.status(201).json(newTodo);
})

app.put('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    const { title, description } = req.body;
    if (todoIndex !== -1) {
        todos[todoIndex].title = title;
        todos[todoIndex].description = description;
        console.table(todos);
        writeToFile();
        res.status(200).send(todos[todoIndex]);
    } else {
        res.status(404).send();
    }
})

app.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id));
    if (todoIndex !== -1) {
        console.table(todos);
        todos.splice(todoIndex, 1);
        writeToFile();
        res.status(200).send();
    } else {
        res.status(404).send();
    }
})

app.use((req, res, next) => {
    res.status(404).send();
})

app.listen(3000, console.log("Running"));
module.exports = app;