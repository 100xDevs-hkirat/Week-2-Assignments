const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
let todos;
todos = fs.readFileSync("todoData.json", "utf-8", (err) => {
  if (err) {
    console.log(err);
  }
});
todos = JSON.parse(todos);
function creteId() {
  var id = Math.floor(Math.random()) * 1000000;
  return id;
}
// console.log(todos);
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
  let id = creteId();
  let todoObject = {
    id: id,
    title: todoTitle,
    description: todoDescription,
  };

  todos.push(todoObject);
  fs.writeFile("todoData.json", JSON.stringify(todos), (err) => {
    console.log(err);
  });
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
  fs.writeFile("todoData.json", JSON.stringify(todos), (err) => {
    console.log(err);
  });
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
  fs.writeFile("todoData.json", JSON.stringify(todos), (err) => {
    console.log(err);
  });
  // console.log(todos);
  res.sendStatus(200);
});
app.get("/*", (req, res) => {
  res.sendStatus(404);
});
app.listen(3000, () => {
  console.log("Listining in 3000");
});
// module.exports = app;
