const express = require('express')
const bodyPareser = require('body-parser')

let app = express()
app.use(bodyPareser.json())

var userDataArray = [];

function checkUsername(username,arr)
{
	for (let i = 0; i < arr.length; i++) 
	{
		var usernames = arr[i].username
		if(usernames == username)
		{
			return i;
		}
	}
	return -1;
}

app.post('/signup' , (req,res) =>{
	var username = req.body.username;
	var password = req.body.password;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var id = Math.floor((Math.random()*1000000))
	var checkUsernames = checkUsername(username, userDataArray)
	if(checkUsernames === -1)
	{
		var tempUserDataObject = 
		{
			id:id,
			username:username,
			password:password,
			firstName:firstName,
			lastName:lastName
		}
		userDataArray.push(tempUserDataObject)
		res.send("Account Created Successfully")
	}
	else
	{
		res.status(200).send("Username Already Exist")
	}
});

app.post("/login", (req, res) => {
	var username = req.body.username
	var password = req.body.password
	var isAccountCreated = checkUsername(username,userDataArray)
	if(isAccountCreated !== -1)
	{
		if(userDataArray[isAccountCreated].username === username && userDataArray[isAccountCreated].password === password)
		{
			res.status(200).json(userDataArray[isAccountCreated])
		}
	}
	else
	{
		res.status(401).send("Unauthorized")
	}

});

app.get('/signup', (req,res) => {
	res.send(userDataArray)
});

app.listen(3000)