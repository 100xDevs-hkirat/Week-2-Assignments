class TodoApp {
    constructor(){
        this.todoList = [];
    }
    getAll = ()=>{
        return this.todoList;
    }

    createNewToDo = (title,description) =>{
        let newTodo = {
            id : Math.floor(Math.random() * 1000000),
            title,
            description
        }
        this.todoList.push(newTodo);
        return newTodo;
    }

    getTodoById = (id) =>{
        let toDo = this.todoList.find((t)=> t.id === parseInt(id));
        return toDo;            
        
    }

    updateTodo = (id, todoObj) => {
        let toDoIndex = this.todoList.findIndex((t)=> t.id === parseInt(id));
       // console.log("toDoIndex:",toDoIndex);
        if(toDoIndex> -1){
            this.todoList[toDoIndex].title = todoObj.title;
            this.todoList[toDoIndex].description = todoObj.description;
         //   console.log("this.todoList[toDoIndex]:",this.todoList[toDoIndex]);
            return this.todoList[toDoIndex];
        }  
        else
        {
            return undefined;
        }
    }

    deleteTodo = (id) =>{
        let toDoIndex = this.todoList.findIndex((t)=> t.id === parseInt(id));
       // console.log("toDoIndex:",toDoIndex);
        if(toDoIndex> -1){
            this.todoList.splice(toDoIndex,1);
        }  
        return toDoIndex;
    }

}

module.exports = TodoApp;