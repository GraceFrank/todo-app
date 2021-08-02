//Selectors
const addTodoForm = document.getElementById("add-todo-form");
const addTodoInput = addTodoForm.children[0].children[0];
const editTodoForm = document.getElementById("edit-todo-form");
const editTodoInput = editTodoForm.children[0].children[0];
const todoList = document.getElementById("todo-list");
const searchInput = document.getElementById("search-input");

let itemToEdit;

//Event Listeners
document.addEventListener("DOMContentLoaded", loadTodoItems);
addTodoForm.addEventListener("submit", addTodoItem);
editTodoForm.addEventListener("submit", editTodoItem);
searchInput.addEventListener("input", search);

//Add Todo Item
function addTodoItem(e) {
  //prevent page from reloading
  e.preventDefault();

  //get the text from input
  const todoTitle = addTodoInput.value;

  //generate date and format date
  const creationDate = getFormattedDate();

  //add it to the list of todo items
  renderTodoItem(todoTitle, creationDate);
  persistTodoItem(todoTitle, creationDate);

  //clear input
  addTodoInput.value = "";
}

//Remove  Todo Item
function removeTodoItem(e) {
  const removeButton = e.target;
  if (confirm("Are you Sure you want to Delete Todo Item?")) {
    const todoItem = removeButton.parentElement;
    todoItem.remove();
    const [title, linebreak, createdAt] = [...todoItem.children[0].children];
    removeTodoFromStore(title.innerText, createdAt.innerText);
  }
}

//Edit  Todo Item
function editTodoItem(e) {
  e.preventDefault();
  const oldTitle = itemToEdit.innerText;
  const createdAt = itemToEdit.parentElement.children[2].innerText;
  const newTitle = editTodoInput.value;
  itemToEdit.textContent = newTitle;
  hideElement(editTodoForm);
  editTodoInput.value = "";

  showElement(addTodoForm);
  itemToEdit = null;
  console.log(createdAt);
  editTodInStore(oldTitle, createdAt, newTitle);
}

function showEditButton(e) {
  const editButton = e.target;
  const todoDiv = editButton.previousSibling.previousSibling;
  const todoTitle = todoDiv.children[0];
  hideElement(addTodoForm);
  showElement(editTodoForm);
  itemToEdit = todoTitle;
  editTodoInput.value = todoTitle.textContent;
}

//Copy  Todo Item
function copyTodoItem(e) {
  const copyButton = e.target;
  const todoDiv = copyButton.previousSibling;
  const todoTitle = todoDiv.children[0].textContent;
  const cb = navigator.clipboard;
  cb.writeText(todoTitle);
}

//Search
function search(e) {
  const searchString = e.target.value;
  const todoItems = todoList.childNodes;

  todoItems.forEach(function (todoItem) {
    const todoTitle = todoItem.children[0].children[0].textContent;

    if (todoTitle.includes(searchString)) {
      todoItem.style.display = "flex";
    } else {
      hideElement(todoItem);
    }
  });
}

//show Element
function showElement(element) {
  element.style.display = "block";
}

//hide Element
function hideElement(element) {
  element.style.display = "none";
}

// Date Formatter
function getFormattedDate() {
  const formattingOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Date().toLocaleTimeString("en-us", formattingOptions);
}

function renderTodoItem(todoTitle, creationDate) {
  const todoItem = document.createElement("li");
  todoItem.classList.add("list-group-item");
  todoItem.innerHTML = `<div class="todo-item">
              <strong>${todoTitle}</strong><br />
              <span>${creationDate}</span>
            </div>`;
  //Append copy Button
  const copyButton = document.createElement("button");
  copyButton.innerHTML = `<i class="bi bi-clipboard"></i>`;
  copyButton.addEventListener("click", copyTodoItem);
  todoItem.appendChild(copyButton);

  //Append Edit Button
  const editButton = document.createElement("button");
  editButton.innerHTML = `<i class="bi bi-pencil-fill"></i>`;
  editButton.addEventListener("click", showEditButton);
  todoItem.appendChild(editButton);

  //Append Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="bi bi-x-square-fill"></i>`;
  deleteButton.addEventListener("click", removeTodoItem);
  todoItem.appendChild(deleteButton);

  //Append Li to Ul
  todoList.appendChild(todoItem);
}

//Save TodoItems in Local Storage
function persistTodoItem(title, createdAt) {
  let todoItems;

  //check if someItems are already in local storage
  const existingTodoItems = localStorage.getItem("todoItems");
  if (!existingTodoItems) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(existingTodoItems);
  }
  todoItems.push({ title, createdAt });
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function removeTodoFromStore(title, createdAt) {
  let todoItems;

  //check if someItems are already in local storage
  const existingTodoItems = localStorage.getItem("todoItems");
  if (!existingTodoItems) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(existingTodoItems);
  }

  //get index of item
  const todoIndex = todoItems.findIndex(
    (item) => item.title === title && item.createdAt === createdAt
  );
  todoItems.splice(todoIndex, 1);
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function editTodInStore(title, createdAt, newTitle) {
  let todoItems;

  //check if someItems are already in local storage
  const existingTodoItems = localStorage.getItem("todoItems");
  if (!existingTodoItems) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(existingTodoItems);
  }

  //get index of item
  const todoIndex = todoItems.findIndex(
    (item) => item.title === title && item.createdAt === createdAt
  );
  todoItems[todoIndex].title = newTitle;
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

function loadTodoItems() {
  let todoItems;
  const storedTodos = localStorage.getItem("todoItems");
  if (!storedTodos) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(storedTodos);
  }
  todoItems.forEach(function (todo) {
    //Create todo div
    renderTodoItem(todo.title, todo.createdAt);
  });
}
