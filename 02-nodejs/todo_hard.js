const express = require("express")
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let idcount = 1;

app.get('/todos', (req,res)=>{
    fs.readFile("todos.json","utf8",(err,data)=>{
        if(err) throw err;
        res.json(JSON.parse(data));
    });
});

app.get('/todos/:id',(req,res)=>{
    fs.readFile("todos.json","utf8",(err,data)=>{
        if(err) throw err;
        const toDos = JSON.parse(data);
        const todoIndex = toDos.findIndex(item=>item.id === parseInt(req.params.id));
        if(todoIndex === -1)
            res.status(404).send();
        else
            res.json(toDos[todoIndex]);
    });
});

app.post('/todos',(req,res)=>{
    const newtoDo = {
        id: idcount,
        title: req.body.title,
        description: req.body.description
    };
    fs.readFile("todos.json","utf8",(err,data)=>{
        if(err) throw err;
        const todo = JSON.parse(data);
        todo.push(newtoDo);
        idcount++;
        fs.writeFile("todos.json",JSON.stringify(todo),(err)=>{
            if(err) throw err;
            res.status(201).json(newtoDo);
        });
    });
});

app.put('/todos/:id',(req,res)=>{
    fs.readFile("todos.json","utf8",(err,data)=>{
        if(err) throw err;
        const todo = JSON.parse(todo);
        const todoIndex = todo.findIndex(item => item.id === parseInt(req.params.id));
        if(todoIndex === -1)
            res.status(404).send();
        else{
            const updatedtodo = {
                id: todo[todoIndex].id,
                title: req.body.title,
                description: req.body.description
            };
            todo[todoIndex] = updatedtodo;
            fs.writeFile("todos.json",JSON.stringify(todo),(err)=>{
                if(err) throw err;
                res.status(200).json(updatedtodo);
            });
        }
    });
});

app.delete('/todos/:id',(req,res)=>{
    fs.readFile("todos.json","utf8", (err,data)=>{
        if(err) throw err;
        const todos = JSON.parse(data);
        const todoIndex = todos.findIndex(item=>item.id === parseInt(req.params.id));
        if(todoIndex === -1)
            res.sendStatus(404);
        else{
            todos.slice(todoIndex,1);
            fs.writeFile("todos.json",JSON.stringify(todos),(err)=>{
                if(err) throw err;
                res.sendStatus(200);
            });
        }
    });
});

app.all('*',(req,res)=>{
    res.sendStatus(404);
});

app.listen(3000);