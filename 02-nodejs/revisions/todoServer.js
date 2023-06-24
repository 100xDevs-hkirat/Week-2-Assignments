const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
const todos = [{ id: "1", name: "Nishant" }];

//Get Method
app.get("/todos", (req, res) => {
  res.send(todos);
});

//Post Method
app.post("/todos", (req, res) => {
  const newTodo = {
    name: req.body.name,
    id: Math.floor(Math.random() * 10),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

//Update Method
app.put("/todos/:id", (req, res) => {
  const paramsId = req.params.id;

  const todoIndex = todos.findIndex((item) => item.id === paramsId);

  console.log(todoIndex);
  if (todoIndex !== -1) {
    todos[todoIndex].name = req.body.name;
    res.status(200).json(todos[todoIndex]);
  } else {
    res.send("This data is not present in your todos!");
  }
});

//Delete Method
app.delete("/todos/:id", (req, res) => {
  const todoIndex = todos.findIndex((item) => item.id === req.params.id);

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    res.send("Deleted Successfully");
  } else {
    res.send("Todo is not present in your todoslist.");
  }
});

app.use((req, res) => {
  res.send("No any route!");
});

app.listen(PORT, (req, res) => {
  console.log("App is listening on port", PORT);
});
