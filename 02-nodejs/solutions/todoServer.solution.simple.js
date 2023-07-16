const express = require('express')
const bodyPareser = require('body-parser')
const fs = require('fs')
const cors = require('cors');


const app = express()
app.use(bodyPareser.json())

app.use(cors());

function getIndexOfId(index,data)
{
	for (let i = 0; i < data.length; i++) 
	{
		if(data[i].id == index) return i;
	}
	return -1;
}

function removeIndex(index, arr) {
	let newArray = [];
	for (let i = 0; i < arr.length; i++) {
	  if (i !== index) newArray.push(arr[i]);
	}
	return newArray;
  }

app.post('/todos' , (req , res) => {
	const newTodos = 
	{
		id : Math.floor(Math.random() * 1000000), // unique random id
		title : req.body.title,
		description : req.body.description
	}

	fs.readFile('./todos.json','utf-8',(err,data) =>{
		var todos = [];
		if(err) throw err;
		if(data) 
		{
			todos = JSON.parse(data);
		}
		todos.push(newTodos)
		fs.writeFile('./todos.json',JSON.stringify(todos),(err) =>{
			if(err) throw err
		});
		res.status(201).json(newTodos)
	});
});

app.get('/todos' , (req,res) =>{
	fs.readFile('./todos.json','utf-8',(err,data) =>{
		if(err) throw err;
		if(!data)
		{
			res.send(("No Records Found"));
			
		}
		else
		{
			res.json(JSON.parse(data));
		}
	});
});

app.delete('/todos/:id' , (req,res) =>{
	let index = req.params.id
	fs.readFile('./todos.json','utf-8',(err,data) =>{
		if(err) throw err;
		var oldData = JSON.parse(data);
		var todos = [];
		var isIndexAvailable = getIndexOfId(index,oldData);
		if(isIndexAvailable === -1) return res.status(400).send("No Records Found");
		todos = removeIndex(isIndexAvailable,oldData);
		fs.writeFile('./todos.json',JSON.stringify(todos),(err) =>{
			if(err) throw err;
			res.send("Record Deleted").status(200);
		})
	});
});

app.put('/todos/:id',(req,res) =>{
	var todos = [];
	var index = req.params.id;
	var updateData = 
	{
		title:req.body.title,
		description:req.body.description
	}
	fs.readFile('./todos.json','utf-8',(err,data) =>{
		if(err) throw err;
		var oldData = JSON.parse(data);
		var getIndexOfIds = getIndexOfId(index,oldData)
		if(getIndexOfIds === -1) res.status(400).send("No Records Found")
		for (let i = 0; i < oldData.length; i++) 
		{
			if(i === getIndexOfIds)
			{
				oldData[i].title = updateData.title,
				oldData[i].description = updateData.description
				todos.push(oldData)
			}
			else
			{
				todos.push(oldData[i])
			}
		}
		fs.writeFile('./todos.json',JSON.stringify(todos),(err) =>{
			if(err) throw err
		});
		res.status(200).send("Record Updated Successfully")
		
	});
});

app.listen(3000)