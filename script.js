
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const dateInput = document.getElementById("task-date");
  const addBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const searchInput = document.getElementById("search-input");


  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");


  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

 
  function genId() {
    return Date.now().toString(36) + "-" + Math.floor(Math.random() * 10000).toString(36);
  }

  
  function validText(text) {
    return text && text.length >= 3 && text.length <= 255;
  }

  
  function validDateOrEmpty(dateStr) {
    if (!dateStr) return true;
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0,0,0,0);
    return d > today; 
  }


  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${q})`, "ig");
    return escapeHtml(text).replace(re, '<span class="highlight">$1</span>');
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderTasks(filter = "") {
    taskList.innerHTML = "";

   
    const useFilter = filter && filter.trim().length >= 2;
    const q = useFilter ? filter.trim().toLowerCase() : "";

    
    tasks.forEach((task) => {
      const matches = !useFilter || task.text.toLowerCase().includes(q);
      if (!matches) return;

      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = task.id;

   
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !!task.done;
      checkbox.addEventListener("change", (e) => {
        task.done = checkbox.checked;
        saveTasks();
      });

     
      const textSpan = document.createElement("span");
      textSpan.className = "task-text";
      textSpan.innerHTML = highlight(task.text, q);
      textSpan.addEventListener("click", () => startEdit(task.id));

   
      const dateSpan = document.createElement("span");
      dateSpan.className = "task-date";
      dateSpan.textContent = task.date || "";

    
      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.title = "Usuń zadanie";
      delBtn.innerHTML = "🗑️";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTaskById(task.id);
      });

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(dateSpan);
      li.appendChild(delBtn);

      taskList.appendChild(li);
    });
  }

  
  function deleteTaskById(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks(searchInput.value);
  }

  
  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const date = dateInput.value;

    if (!validText(text)) {
      alert("Zadanie musi mieć od 3 do 255 znaków.");
      return;
    }
    if (!validDateOrEmpty(date)) {
      alert("Data musi być pusta albo znajdować się w przyszłości.");
      return;
    }

    const newTask = {
      id: genId(),
      text,
      date: date || "",
      done: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    dateInput.value = "";
  });

  
  searchInput.addEventListener("input", () => {
    renderTasks(searchInput.value);
  });


  let currentEditor = null; 
  function startEdit(id) {
    
    if (currentEditor && currentEditor.id !== id) {
      finishEdit(currentEditor.id);
    } else if (currentEditor && currentEditor.id === id) {
      return; 
    }

    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    const task = tasks[idx];

    const li = taskList.querySelector(`li[data-id="${id}"]`);
    if (!li) return;

    
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "edit-text";
    textInput.value = task.text;

    const dateEdit = document.createElement("input");
    dateEdit.type = "date";
    dateEdit.className = "edit-date";
    dateEdit.value = task.date || "";

    
    const saveBtn = document.createElement("button");
    saveBtn.className = "edit-save";
    saveBtn.textContent = "Zapisz";

    
    li.innerHTML = "";
    li.appendChild(textInput);
    li.appendChild(dateEdit);
    li.appendChild(saveBtn);

    textInput.focus();

  
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      finishEdit(id);
    });


    function onDocClick(e) {
    
      if (li.contains(e.target)) return;
      finishEdit(id);
    }
    document.addEventListener("mousedown", onDocClick);

    currentEditor = { id, removeListener: () => document.removeEventListener("mousedown", onDocClick) };
  }


  function finishEdit(id) {
    if (!currentEditor || currentEditor.id !== id) {

      renderTasks(searchInput.value);
      return;
    }

    const li = taskList.querySelector(`li[data-id="${id}"]`);
    if (!li) {
      currentEditor.removeListener();
      currentEditor = null;
      renderTasks(searchInput.value);
      return;
    }

    const textInput = li.querySelector(".edit-text");
    const dateEdit = li.querySelector(".edit-date");

    const newText = textInput ? textInput.value.trim() : null;
    const newDate = dateEdit ? dateEdit.value : "";

    if (!validText(newText)) {
      alert("Zadanie musi mieć od 3 do 255 znaków.");
     
      currentEditor.removeListener();
      currentEditor = null;
      renderTasks(searchInput.value);
      return;
    }
    if (!validDateOrEmpty(newDate)) {
      alert("Data musi być pusta albo znajdować się w przyszłości.");
      currentEditor.removeListener();
      currentEditor = null;
      renderTasks(searchInput.value);
      return;
    }

    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      tasks[idx].text = newText;
      tasks[idx].date = newDate || "";
      saveTasks();
    }

    currentEditor.removeListener();
    currentEditor = null;
    renderTasks(searchInput.value);
  }


  renderTasks();

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
  dateInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
});
