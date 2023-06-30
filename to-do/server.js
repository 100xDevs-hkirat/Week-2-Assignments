const express = require('express');
const bodyParser = require('body-parser');
const fs= require('fs');
const app = express();
app.use(express.json())

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/data",(req,res)=>{
    fs.readFile("database.json","utf-8",(err,data)=>{
        if (err) throw err;
        res.json(JSON.parse(data))
    })
})

app.post("/todo",(req,res)=>{
    const val = req.body
    const new_todo = {
        "id":Math.floor(Math.random()*100000),
        "title":val.title,
        "status":val.status
    }
    fs.readFile("database.json","utf-8",(err,data)=>{
        if (err) throw err;
        const todos = JSON.parse(data)
        todos.push(new_todo)
        fs.writeFile("database.json",JSON.stringify(todos),(err)=>{
            if (err) throw err;
            res.json(new_todo)
        })
    })
})

app.delete("/todo/:id",(req,res)=>{
    const target = req.params.id;
    fs.readFile("database.json","utf-8",(err,data)=>{
        if (err) throw err;
        let total_data = JSON.parse(data)
        for (i=0;i<total_data.length;i++){
            if(total_data[i].id == target){
                const removed_target = total_data.splice(i,1)
                fs.writeFile("database.json",JSON.stringify(total_data),(err)=>{
                    if (err) throw err
                    res.json(removed_target)
                })
            }
        }

    })
})

app.listen(3001,()=>{
    console.log("server started in port 3000")
})