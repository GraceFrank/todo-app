//Selectors
const addTodoForm = document.getElementById("add-todo-form");
const addTodoInput = document.getElementById("add-todo-input");
const todoList = document.getElementById("todo-list");

//Event Listeners
addTodoForm.addEventListener("submit", addTodoItem);

//Add Todo Item
function addTodoItem(e) {
  //prevent page from reloading
  e.preventDefault();

  //get the text from input
  const todoTitle = addTodoInput.value;

  //generate date and format date
  const creationDate = getFormattedDate();

  //add it to the list of todo items
  const todoItem = document.createElement("li");
  todoItem.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between"
  );
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
  editButton.addEventListener("click", editTodoItem);
  todoItem.appendChild(editButton);

  //Append Delete Button
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="bi bi-x-square-fill"></i>`;
  deleteButton.addEventListener("click", removeTodoItem);
  todoItem.appendChild(deleteButton);

  //
  todoList.appendChild(todoItem);

  //clear input
}

//Remove  Todo Item
function removeTodoItem(e) {
  const removeButton = e.target;
  if (confirm("Are you Sure you want to Delete Todo Item?")) {
    const todoItem = removeButton.parentElement;
    todoItem.remove();
  }
}

//Edit  Todo Item
function editTodoItem() {
  alert("edit");
}

//Copy  Todo Item
function copyTodoItem(e) {
  const copyButton = e.target;
  const todoDiv = copyButton.previousSibling;
  const todoTitle = todoDiv.children[0].textContent;
  const cb = navigator.clipboard;
  cb.writeText(todoTitle);
}

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
