const addForm = document.querySelector(".add");
const search = document.querySelector(".search input");
const list = document.querySelector(".todos");

// Render todos from local storage
const renderTodos = () => {
  const todos = getTodosFromLS();
  todos.forEach(todo => {
    const template = generateTemplate(todo);
    list.insertAdjacentHTML("beforeend", template);
  });
};

// Retrieve todos from local storage
const getTodosFromLS = () => JSON.parse(localStorage.getItem("todos")) || [];

// Generate HTML template for each todo item
const generateTemplate = todo => {
  const completedClass = todo.completed ? "completed" : "";
  return `
    <li class="list-group-item d-flex justify-content-between align-items-center ${completedClass}" data-id=${todo.id}>
      <span>${todo.todo}</span>
      <div class="icons">
        <i class="fa-solid fa-check"></i>
        <i class="far fa-trash-alt delete"></i>
      </div>
    </li>
  `;
};

// Add todo
addForm.addEventListener("submit", e => {
  e.preventDefault();
  const todoInput = addForm.add.value.trim();

  if (todoInput.length > 0) {
    const todos = getTodosFromLS();
    const newTodo = {
      todo: todoInput,
      completed: false,
      id: new Date().getTime().toString(),
    };
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

    const template = generateTemplate(newTodo);
    list.insertAdjacentHTML("beforeend", template);
    addForm.reset();
  }
});

// Delete todo
list.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    const deletedTodo = e.target.closest("li");
    deletedTodo.remove();

    const todos = getTodosFromLS();
    const filteredTodos = todos.filter(
      todo => todo.id !== deletedTodo.dataset.id
    );
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  }
});

// Toggle completed state
list.addEventListener("click", e => {
  if (e.target.classList.contains("fa-check")) {
    const completedTodo = e.target.closest("li");
    completedTodo.classList.toggle("completed");

    const todos = getTodosFromLS();

    const updatedTodos = todos.map(todo => {
      if (todo.id === completedTodo.dataset.id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }
});

// Filter todos
const filterTodos = term => {
  const todos = Array.from(list.children);
  todos.forEach(todo => {
    const todoText = todo.querySelector("span").textContent.toLowerCase();
    if (todoText.includes(term.toLowerCase())) {
      todo.classList.remove("filtered");
    } else {
      todo.classList.add("filtered");
    }
  });
};

search.addEventListener("keyup", () => {
  const term = search.value.trim();
  filterTodos(term);
});

// Initial rendering of todos
renderTodos();
