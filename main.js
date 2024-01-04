document.addEventListener("DOMContentLoaded", function () {
  // Element selectors
  const todoInput = document.getElementById("todo-input");
  const addButton = document.getElementById("add-button");
  const taskList = document.getElementById("task-list");
  const dueDateInput = document.getElementById("duedate-input");
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const prioritySelect = document.getElementById("priority-select");
  const backdrop = document.createElement("li");

  // Variables for storing and editing tasks
  let selectedDueDate = ''; // For storing due date
  let editDateInput; // For editing date input
  let editMode = false; 

  // Function to save tasks
  function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#task-list li").forEach(task => {
      tasks.push({
        text: task.querySelector("span").textContent,
        priority: task.querySelector(".priority-value").textContent,
        dueDate: task.querySelector(".due-date").textContent
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Function to create a task element
  function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span>${task.text}</span>
      <span class="priority-value">${task.priority}</span>
      <input type="text" name="text" class="edit-duedate-input" style="display: none">
      <span class="due-date">${task.dueDate}</span>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>

    `;

    // Priority dropdown for editing
    const priorityDropdown = createPriorityDropdown(task.priority);
    listItem.querySelector(".priority-value").after(priorityDropdown);

    // Delete task event listener
    listItem.querySelector(".delete-button").addEventListener("click", function () {
      listItem.remove();
      saveTasks(); // Update tasks in local storage after deletion
    });

    // Edit task event listener
    listItem.querySelector(".edit-button").addEventListener("click", function () {
      toggleEditMode(listItem, priorityDropdown);
      saveTasks();
    });

    return listItem;
  }

  // Function to load tasks from local storage
  function loadTasks() {
    const tasksJSON = localStorage.getItem('tasks');
    const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
  
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
    });
  }

  // Initialize task loading
  loadTasks();

  // Hamburger menu toggle
  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    backdrop.style.display = sidebar.classList.contains("open") ? "block" : "none";
  });

  // Backdrop setup
  backdrop.classList.add("backdrop");
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", function () {
    sidebar.classList.remove("open");
    backdrop.style.display = "none";
  });

  // Due date picker initialization
  $(dueDateInput).datepicker({
    onSelect: function (dateText) {
      this.setAttribute("data-date", dateText);
    }
  });

  // Function to create a date input for editing
  function createEditDateInput(input) {
    $(input).datepicker({
      onSelect: function (dateText) {
        input.setAttribute("data-date", dateText);
        const dueDateSpan = input.nextElementSibling;
        dueDateSpan.textContent = dateText;
      },
      onClose: function () {
        this.style.display = "none";
      }
    });
  }

  // Trigger for due date picker
  document.getElementById("duedate-btn").addEventListener("click", function () {
    $(dueDateInput).datepicker('show');
  });

  // Function to create priority dropdown for editing
  function createPriorityDropdown(currentPriority) {
    const select = document.createElement("select");
    select.id = "select-priority" + Math.random().toString(36).substr(2, 9);
    select.innerHTML = `
      <option value="High" ${currentPriority === "High" ? "selected" : ""}>High</option>
      <option value="Medium" ${currentPriority === "Medium" ? "selected" : ""}>Medium</option>
      <option value="Low" ${currentPriority === "Low" ? "selected" : ""}>Low</option>
    `;
    select.className = "edit-priority-select";
    select.style.display = "none";
    return select;
  }

  // Event listener for adding new tasks
  addButton.addEventListener("click", function () {
    const taskText = todoInput.value.trim();
    const dueDate = dueDateInput.getAttribute('data-date');
    const priority = prioritySelect.value;

    if (taskText !== "") {
      const newTask = { text: taskText, priority: priority, dueDate: dueDate || "" };
      const listItem = createTaskElement(newTask);
      taskList.appendChild(listItem);
      todoInput.value = "";
      dueDateInput.setAttribute('data-date', '');
      prioritySelect.selectedIndex = 1; // Reset to default (Medium)
      saveTasks(); // Save new task
    }
  });

  // Toggle edit mode for tasks
  function toggleEditMode(listItem, priorityDropdown) {
  	const taskSpan = listItem.querySelector("span");
  	const newText = prompt("Edit-task:", taskSpan.textContent);
  	const editDateInput = listItem.querySelector(".edit-duedate-input");
  	const dueDateSpan = listItem.querySelector(".due-date");

  	if(!editMode){
  		editMode = true;
  		listItem.querySelector(".priority-value").style.display = "none";
  		priorityDropdown.style.display = "block";
  		editDateInput.style.display = "block";
  		createEditDateInput(editDateInput);
  		$(editDateInput).datepicker("show");
  	}

  	if(newText !== null && newText !== ""){
  		taskSpan.textContent = newText
  	};

  	$(editDateInput).on("change", function () {
  		dueDateSpan.textContent = this.value; //update due date span
  		editDateInput.style.display = "none"; //hide after selection
  		saveTasks()  // save the task after editing
  	});

  	priorityDropdown.addEventListener("change", function () {
  		listItem.querySelector(".priority-value").textContent = this.value;
  		listItem.querySelector(".priority-value").style.display = "block";
  		this.style.display = "none"
  		editMode = false;
  		saveTasks(); //save task
  	});

  	if(!editMode){
  		editDateInput.style.display = "none";
  		priorityDropdown.style.display = "none";
  	}


  }

  // Enter key submits new task
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addButton.click();
    }
  });

  // Sidebar menu item interaction
  const menuItem = document.querySelectorAll('.sidebar .menu-item');
  menuItem.forEach(item => {
    item.addEventListener("click", function () {
      menuItem.forEach(subItem => subItem.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Note for possible future errors
  /*
  Possible Errors Future F would encounter:
  For priority errors: check the ids, then check the dropdown to see if you return select if not it will be lowundefined, then check if the edit
  mode is true and the priority dropdown is visible when !editmode.

  Do the same for due-date and task-list, check ids, datepickers, and addeventlisteners. 
  */
});
