const express = require("express");
const bodyParser = require("body-parser")
const app = express();

app.use(bodyParser.json())

let TITLE = [];
let DESCRIPTION = [];

app.get('/todos', (req,res)=>{
    res.status(200).send({ Title : TITLE , Description : DESCRIPTION })
})

app.get('/todos/:id', (req,res) =>{
    const id = req.params.id;
    res.status(200).send({Title : TITLE[id] , Description : DESCRIPTION[id]});
    console.log(`Title : ${TITLE[id]} , Description : ${DESCRIPTION[id]}`)
})

app.post('/todos' , (req,res)=>{
    const title = req.body.title;
    const description = req.body.description;

    TITLE.push(title)
    DESCRIPTION.push(description)

    res.status(200).send({Title : TITLE , Description : DESCRIPTION})
})

app.put('/todos/:id' , (req,res)=>{
    const id = req.params.id;
    const description = req.body.description;

    if(!DESCRIPTION[id]){
        res.status(404).send({msg : "The todo does not exist"})
    }
    else{
        DESCRIPTION[id] = description;
        res.send({msg : "The description is updated"})
    }
})

app.delete('/todos/:id' , (req,res)=>{
    const id = req.params.id;

    if(!TITLE[id] && !DESCRIPTION[id]){
        res.status(404).send({msg : "the todo does not exist"})
    }
    else{
        TITLE.pop(id);
        DESCRIPTION.pop(id);
        res.status(200).send({msg : "The todo is deleted"})
    }
})

app.listen(3000 , ()=>{console.log("The server is running on 3000")})