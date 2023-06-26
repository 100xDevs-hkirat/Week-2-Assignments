function handleDelete(id) {
  console.log("Deleting");
  fetch(`http://127.0.0.1:3080/todos/${id}`, {
    method: "delete",
  })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

function loadTodos() {
  fetch("http://127.0.0.1:3080/todos")
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched todos: ", data);
      let todoStr = ``;
      data.forEach((todo) => {
        todoStr += `<li>Title: ${todo.title} <br> Description: ${todo.description} <br> <button onclick="handleDelete(${todo.id})">Delete</button></li> <br>`;
      });
      document.getElementById("todos").innerHTML = `
        <h2>Current Todos</h2>
        <ul>${todoStr}</ul>`;
    })
    .catch((err) => console.log(err));
}

loadTodos();

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = e.target[0];
  const description = e.target[1];

  console.log(title.value);
  console.log(description.value);

  const todo = {
    title: title.value,
    description: description.value,
  };
  fetch("http://127.0.0.1:3080/todos", {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },

    body: JSON.stringify(todo),
  })
    .then((response) => {
      console.log("Todo created successfully");
    })
    .catch((err) => {
      console.log("Error occured:", err);
    });

  title.value = "";
  description.value = "";
});
