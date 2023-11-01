const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

function findIndex(arr,id){
    for(var i = 0; i < arr.length; i++){
        if(arr[i].id == id) return i;
    }
    return -1;
}

function removeAtIndex(arr, index){
    const newArray = [];
    for(var i = 0; i < arr.length; i++){
        if(i !== index){
            newArray.push(arr[i]);
        }
    }
    return newArray;
}

app.get('/todos', (req, res) => {
  fs.readFile("todos.json", "utf8" , (err,data) => {
    if(err){
        res.status(400).json({Error: "Error reading file"})
    }
    else{
        res.status(200).json(JSON.parse(data))
    }
  })
})

app.get('/todos/:id', (req,res) => {
    fs.readFile("todos.json","utf8",(err,data) => {
        if(err) throw err;
        var todos = JSON.parse(data);
        const todoIndex = findIndex(todos, parseInt(req.params.id));
        if(todoIndex == -1){
            res.status(400).send("Not Found");
        }
        else{
            res.status(200).json(todos[todoIndex])
        }
    })
})

app.post('/todos',(req,res) => {
    fs.readFile("todos.json", "utf8" , (err,data) => {
        if(err){
            res.status(400).json({Error: "Error reading file"})
        }
        else{
            const newTodo = {
                id: Math.floor(Math.random() * 1000000),
                title: req.body.title,
                description: req.body.description
            }
        const todos = JSON.parse(data);
        todos.push(newTodo);
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            if(err){
                res.status(400).json({Error: "Not able to add todo"})
            }
            else{
                res.status(200).send(newTodo);
            }
        })
        }
    })
})

app.put("/todos/:id", (req,res) => {
    fs.readFile("todos.json","utf8", (err,data) => {
        if(err) throw err;
        var todos = JSON.parse(data);
        const todoIndex = findIndex(todos, parseInt(req.params.id));
        if(todoIndex == -1){
            res.status(404).send();
        }
        else{
            var updatedTodo = {
                id: todos[todoIndex].id,
                title: req.body.title,
                description: req.body.description
            }
            todos[todoIndex] = updatedTodo;
            fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                if(err) throw err;
                res.json(updatedTodo);
            })
        }
    })
})

app.delete("/todos/:id", (req,res) => {
    fs.readFile("todos.json", "utf8", (err,data) => {
        if(err) throw err;
        const originalTodos = JSON.parse(data);
        const todoIndex = findIndex(originalTodos, parseInt(req.params.id));
        if(todoIndex == -1){
            res.status(404).send();
        }
        else{
           const updatedTodos = removeAtIndex(originalTodos, todoIndex);
           fs.writeFile("todos.json", JSON.stringify(updatedTodos), (err) => {
            if(err) throw err;
            res.status(200).send();
        })
        }
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})