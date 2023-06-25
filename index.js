const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let todos = [];

// #HARD-TODO: load todos from a file
fs.readFile(path.join(__dirname, "store.json"), "utf-8", (err, data) => {
  function initiateEmptyStore() {
    fs.writeFile("./store.json", JSON.stringify([]), (err) => {
      if (err) {
        console.log("Error in writing to file");
      } else {
        console.log("Store Created");
      }
    });
  }

  if (err) {
    console.log("inside err here");

    // if there is no file ./store.json create and initiate with []
    initiateEmptyStore();
    return;
  }

  try {
    const todosFromStore = JSON.parse(data);

    if (!Array.isArray(todosFromStore)) {
      todos = [];

      // if parsed data is not array re-initialize store with an array
      initiateEmptyStore();
    } else {
      todos = todosFromStore;
    }
  } catch (e) {
    console.log("JSON parse failed");
    todos = [];

    // if parse fails ( due to invalid JSON ) re-create store and initiate with []
    initiateEmptyStore();
  }
});

function updateStore() {
  fs.writeFile("./store.json", JSON.stringify(todos), (err) => {
    if (err) {
      console.log("Store update failed");
      return;
    }
    console.log("Store updated");
  });
}

// 1.GET /todos
app.get("/todos", (req, res) => {
  res.status(200).send(todos);
});

// 2.GET /todos/:id
app.get("/todos/:id", (req, res) => {
  const { params } = req;

  if (params?.id == undefined) {
    return res.status(400).send({ error: "Expected ID" });
  }

  const todo = todos.find((t) => t.id == params.id);

  if (!todo) {
    return res.status(404).send({ error: "Todo not found" });
  }

  res.status(200).send(todo);
});

// 3. POST /todos
app.post("/todos", (req, res) => {
  const body = req.body;

  const { title, description, completed = false } = body;

  if (!title || !description) {
    return res
      .status(400)
      .send({ error: "Title and description are required" });
  }

  const todoId = todos.length + 1;

  const dbTodo = {
    id: todoId,
    title,
    description,
    completed,
  };

  todos.push(dbTodo);

  updateStore();

  res.status(201).send({ id: todoId });
});

// 4. PUT /todos/:id
app.put("/todos/:id", (req, res) => {
  const { params, body } = req;

  if (params?.id == undefined) {
    return res.status(400).send({ error: "Expected ID" });
  }

  const { title, description, completed } = body;

  if (
    title == undefined &&
    description == undefined &&
    completed == undefined
  ) {
    return res
      .status(400)
      .send({ error: "Expected either one of title, description, completed" });
  }

  const todoIndex = todos.findIndex((t) => t.id == params.id);

  if (todoIndex < 0) {
    return res.status(404).send({ error: "Todo not found" });
  }

  const updatedTodo = {
    ...todos[todoIndex],
    title: title ?? todos[todoIndex].title,
    description: description ?? todos[todoIndex].description,
    completed: completed ?? todos[todoIndex].completed,
  };

  todos[todoIndex] = updatedTodo;

  updateStore();

  res.status(200).send(updatedTodo);
});

// 5. DELETE /todos/:id

app.delete("/todos/:id", (req, res) => {
  const { params } = req;

  if (params?.id == undefined) {
    return res.status(400).send({ error: "Expected ID" });
  }

  const todo = todos.find((t) => t.id == params.id);

  if (!todo) {
    return res.status(404).send({ error: "Todo not found" });
  }

  const updatedTodos = todos.filter((t) => t.id != params.id);

  todos = updatedTodos;

  updateStore();
  res.status(200).send({ message: "Todo Deleted" });
});

app.use("/", express.static(path.resolve(__dirname, "fe")));

// handle un-configured routes
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Dev Mode
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}, http://localhost:${PORT}`);
});

// module.exports = app;
