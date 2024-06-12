class Todo {
  constructor(id, title, completed, description) {
    this.id = id;
    if (title != null) {
      this.title = title;
    }

    if (completed != null) {
      this.completed = completed;
    }

    if (description != null) {
      this.description = description;
    }
  }
}

module.exports = Todo;
