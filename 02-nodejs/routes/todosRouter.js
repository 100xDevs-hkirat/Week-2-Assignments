/*
 1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

*/ 

const express = require('express');
const   router = express.Router();

router.use(express.json())
express.urlencoded({ extended: false })

// parse application/json


const todos = [];
let count = 0;

const listTodos = (req, res) => {

    res.json(todos);

}

const getTodo = (req, res) => {
    let {id} = req.params
    
    try{
        id = parseInt(id);
    } catch(err) {
        return res.status(404).json({msg: err.msg});
    }
    const ind = todos.findIndex(todo => todo.id === id);

    if(ind === -1) return res.status(404).json({"msg": "id not found while getting"});
    
    return res.status(200).json(todos[ind]);
}

const addTodo = (req, res) => {
    console.log(req.body);
    
    const {title, description} = req.body;
    const id = Math.floor(Math.random() * 100000);

    todos.push({id, title, description});
    
    res.status(201).json({id});
}   

const updateTodo = (req, res) => {
    let{id} = req.params, {title, description} = req.body;
    
    try{
        id = parseInt(id);
    } catch(err) {
        return res.status(404).json({msg: err.msg});
    }
    const ind = todos.findIndex(todo => todo.id === id);
    
    if(ind === -1){
        return res.status(404).json({"msg": "id not found while updating"});
    }
    todos[ind].title = title;
    todos[ind].description = description;

    res.status(200).json(todos[ind]);
}


const deleteTodo = (req, res) => {
    let {id} = req.params;
    
    try{
        id = parseInt(id);
    } catch(err) {
        return res.status(404).json({msg: err.msg});
    }
    
    const ind = todos.findIndex(todo => todo.id === id);

    if(ind === -1) return res.status(404).json({"msg": "id not found while deleting"});
    
    todos.splice(ind,1);
    
    res.json({"message": "deleted todo"});
}
// METHODS

router.get('/',listTodos);
router.get('/:id', getTodo);
router.post('/', addTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
