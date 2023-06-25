const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

const app = express();
port = '3000'
// let todos = [{ id: "1", title: 'new todo1', description: "description of new tood1" },
// { id: "2", title: 'new todo2', description: "description of new tood2" }]
app.use(bodyParser.json());
app.get("/todos", (req, res) => {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            res.status(503).json({ err: "error in reading file" })
        } else {
            data = JSON.parse(data)
            res.json(data)
        }

    })
})

app.get("/todos/:id", (request, response) => {
    let id = request.params.id
    // console.log(`id: ${id}, ${typeof (id)}`)
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            res.status(503).json({ err: "error in reading file" })
        } else {
            todos = JSON.parse(data)
            let elem = todos.find(item => item.id === id)
            if (!elem) {
                response.status(404).send()
            } else {
                response.send(elem)
            }
        }

    })

})

app.post("/todos", (req, res) => {
    const postID = uuidv4()
    const { title, description } = req.body
    const newPost = {
        title,
        description,
        id: postID
    }
    fs.readFile('todos.json', "utf8", (err, data) => {
        if (err) {
            res.status(503).json({ err: "error in reading db" })
        } else {
            let todos = JSON.parse(data)
            todos.push(newPost)
            fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                if (err) {
                    res.status(503).json({ err: "error in saving to db" })
                }
                else {
                    res.status(201).send(newPost)
                }
            })
        }
    })
})

app.put("/todos/:id", (req, res) => {
    let id = req.params.id
    const { title, description } = req.body
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            res.status(503).json({ err: "error in reading db" })
        } else {
            let todos = JSON.parse(data)
            let index = todos.findIndex(item => item.id === id)
            if (index === -1) {
                res.status(404).send()
            } else {
                todos[index].title = title
                todos[index].description = description
                fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
                    if (err) {
                        res.status(503).json({ err: "error in saving the update" })
                    } else {
                        res.send()
                    }
                })
            }
        }
    })

})

app.delete("/todos/:id", (req, res) => {
    let id = req.params.id
    fs.readFile('todos.json', 'utf8', (err, data) => {
        if (err) {
            res.status(503).json({ err: "err in reading db" })
        } else {
            let todos = JSON.parse(data)
            let index = todos.findIndex(item => item.id === id)
            if (index === -1) {
                res.status(404).send()
            } else {
                todos.splice(index, 1)
                fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
                    if (err) {
                        res.status(503).json({ err: "failed to delete from db" })
                    }
                    else {
                        res.send()
                    }
                })
            }
        }
    })


})

app.listen(port, () => {
    console.log(`listening at port http://localhost:${port}`)
})
module.exports = app;
