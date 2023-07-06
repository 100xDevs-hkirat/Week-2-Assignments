const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");


const app = express();
// app.listen(3000,()=>{
//   console.log("Example app listening on port 3000");
// });

app.use(bodyParser.json());

app.get('/todos', (req, res)=>{
    fs.readFile("./todos.json","utf-8",(err, data)=>{
        if(err){
            res.status(404).send();
        }else{          
          if(!data || JSON.stringify(data) === "{}"){
            res.json([]);
          }else{
            res.json(JSON.parse(data));
          }
        }
    });
});

app.get('/todos/:id',(req, res)=>{
    fs.readFile("./todos.json", "utf-8", (err, data) => {
        if (err) throw err;
        if(!data){
          res.status(404).send();
        }
        const todos = (JSON.parse(data));
        const task = todos.find(t => t.id === parseInt(req.params.id));
        if(!task){
            res.status(404).send();
        }else{
            res.json(task);
        }
    });
  });

app.post('/todos', (req, res) => {
    const newTodo = {
      id: Math.floor(Math.random() * 1000000), // unique random id
      title: req.body.title,
      description: req.body.description
    };
    fs.readFile("./todos.json", "utf-8", (err, data) => {
      if (err) throw err;
      let todos =[];
      if(!data){
        todos.push(newTodo);
      }else{
      todos=(JSON.parse(data));
      todos.push(newTodo);
      }
      fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(201).json(newTodo);
      });
    });
  });

  app.put('/todos/:id',(req, res)=>{
    fs.readFile("./todos.json", "utf-8", (err, data) => {
    if(err) throw err;
    if(!data){
      res.status(404).send();
    }else{
    const todos = JSON.parse(data);
    const taskId = todos.findIndex(t => t.id === parseInt(req.params.id));
    if(taskId === -1){
      res.status(404).send();
    }else{
      todos[taskId].title = req.body.title;
      todos[taskId].description = req.body.description;
      fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.json(todos[taskId]);
      });      
    }
  }       
  });
});
  
  app.delete('/todos/:id', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
    if(err) throw err;
    if(!data){
      res.status(404).send();
    }else{
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos.splice(todoIndex, 1);
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).send();
      });
      
    }
  }
  });
});
  
  app.use((req, res, next) => {
    res.status(404).send();
  });
  
  module.exports = app;
  