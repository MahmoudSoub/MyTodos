const addForm = document.querySelector(".add");
const search = document.querySelector(".search input");
const list = document.querySelector(".todos");
const getTodos = () => JSON.parse(localStorage.getItem("todos")) || [];

const generateTemplate = todo => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span>${todo}</span>
      <div class="icons">
        <i class="fa-solid fa-check"></i>
        <i class="far fa-trash-alt delete"></i>
      </div>
    </li>
`;

const renderLocalStorageTodos = () => {
  const todos = getTodos();
  todos.forEach(todo => {
    const generatedTemplate = generateTemplate(todo);
    list.innerHTML += generatedTemplate;
  });
};
renderLocalStorageTodos();

// add todos event
addForm.addEventListener("submit", e => {
  e.preventDefault();
  const todo = addForm.add.value.trim();

  if (todo.length > 0) {
    const todos = getTodos();
    localStorage.setItem("todos", JSON.stringify([...todos, todo]));
    const generatedTemplate = generateTemplate(todo);
    list.innerHTML += generatedTemplate;
    addForm.reset();
  }
});

// delete todos event
list.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    const deletedTodo = e.target.parentElement.parentElement;
    deletedTodo.remove();
    const todos = getTodos();
    const deletedTodoText = deletedTodo.textContent.trim();
    const filteredTodos = todos.filter(todo => todo.trim() != deletedTodoText);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  }
});

// completed
list.addEventListener("click", e => {
  if (e.target.classList.contains("fa-check")) {
    const completedTodo = e.target.parentElement.parentElement;
    completedTodo.classList.toggle("completed");
  }
});

// filter todos event
const filterTodos = term => {
  // add filtered class
  Array.from(list.children)
    .filter(todo => !todo.textContent.toLowerCase().includes(term))
    .forEach(todo => todo.classList.add("filtered"));

  // remove filtered class
  Array.from(list.children)
    .filter(todo => todo.textContent.toLowerCase().includes(term))
    .forEach(todo => todo.classList.remove("filtered"));
};

search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  filterTodos(term);
});
