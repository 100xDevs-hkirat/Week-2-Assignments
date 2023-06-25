const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
// port = '8000'
let todos = []
// let todos = [{ id: "1", title: 'new todo1', description: "description of new tood1" },
// { id: "2", title: 'new todo2', description: "description of new tood2" }]
app.use(bodyParser.json());
app.get("/todos", (request, response) => {
  response.send(todos)
})

app.get("/todos/:id", (request, response) => {
  let id = request.params.id
  // console.log(`id: ${id}, ${typeof (id)}`)
  let elem = todos.find(item => item.id === id)
  if (!elem) {
    response.status(404).send()
  } else {
    response.send(elem)
  }
})

app.post("/todos", (req, res) => {
  const postID = uuidv4()
  const { title, description } = req.body
  const newPost = {
    title,
    description,
    id: postID
  }
  console.log(newPost)
  todos.push(newPost)
  res.status(201).send(newPost)

})

app.put("/todos/:id", (req, res) => {
  let id = req.params.id
  const { title, description } = req.body
  let index = todos.findIndex(item => item.id === id)
  if (index === -1) {
    res.status(404).send()
  } else {
    todos[index].title = title
    todos[index].description = description
    res.send()
  }

})

app.delete("/todos/:id", (req, res) => {
  let id = req.params.id
  let index = todos.findIndex(item => item.id === id)
  if (index === -1) {
    res.status(404).send()
  } else {
    todos.splice(index, 1)
    res.send()
  }

})

// app.listen(port, () => {
//   console.log(`listening at port http://localhost:${port}`)
// })
module.exports = app;
