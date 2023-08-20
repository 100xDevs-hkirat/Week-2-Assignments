const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function caluclateSum(value) {
    var sum = 0;
    for(var i = 1; i <= value; i++) {
        sum = sum + i;
    }

    return sum;
}


/*

We can also use req.headers to post the data to the backend. 

To request something to the server, We need to send an HTTP request. 

While sending HTTP requests, there are three ways to send the data. 
1. Query Params. ( We can directly pass these via URL and access them via req.query) 
2. Headers. (We can't directly pass these via URL but we can send headers from PostMan and access them via req.headers)
3. Body. 

app.post("/caluclateSum", (req, res) => {
  console.log("Headers");
  console.log(JSON.stringify(req.headers));

  var value = req.headers.header1;

  res.send("Sum" + caluclateSum(value));

})

*/

/*

One way to get the data from the url (GET) - query params. 

app.get("/caluclateSum", (req, res) => {
  var val = req.query.counter;

  res.send("Sum " + caluclateSum(val));
})

*/

/*

Sending data to backend server via HTTP Server created by Express. 

app.get("/caluclateSum", (req, res) => {
    res.send("Sum is " + caluclateSum(10));
})

*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


