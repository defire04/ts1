const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filterBtn');

let tasks = [];

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function toggleTaskCompletion(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  let filteredTasks;
  switch (filter) {
    case 'active':
      filteredTasks = tasks.filter(task => !task.completed);
      break;
    case 'completed':
      filteredTasks = tasks.filter(task => task.completed);
      break;
    default:
      filteredTasks = tasks;
  }
  renderTasks(filteredTasks);
}

function renderTasks(tasksToRender = tasks) {
  taskList.innerHTML = '';
  tasksToRender.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
      li.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    const createdAt = document.createElement('small');
    createdAt.textContent = `Created: ${new Date(task.createdAt).toLocaleString()}`;

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    li.appendChild(createdAt);

    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterTasks(btn.dataset.filter);
  });
});

loadTasks();

function editTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    const newText = prompt('Enter new task text:', task.text);
    if (newText !== null) {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
}

function sortTasks(sortBy) {
  switch (sortBy) {
    case 'date':
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'alphabetical':
      tasks.sort((a, b) => a.text.localeCompare(b.text));
      break;
    case 'completed':
      tasks.sort((a, b) => a.completed - b.completed);
      break;
  }
  renderTasks();
}

function getTasksStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return {
    total: totalTasks,
    completed: completedTasks,
    active: activeTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) + '%' : '0%'
  };
}

function displayStats() {
  const stats = getTasksStats();
  console.log('Task Statistics:');
  console.log(`Total tasks: ${stats.total}`);
  console.log(`Completed: ${stats.completed}`);
  console.log(`Active: ${stats.active}`);
  console.log(`Completion rate: ${stats.completionRate}`);
}

function exportTasks() {
  const tasksJSON = JSON.stringify(tasks, null, 2);
  const blob = new Blob([tasksJSON], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();

  URL.revokeObjectURL(url);
}

function importTasks(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedTasks = JSON.parse(e.target.result);
      tasks = importedTasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      saveTasks();
      renderTasks();
      alert('Tasks successfully imported!');
    } catch (error) {
      alert('Error importing tasks. Please check the file format.');
    }
  };
  reader.readAsText(file);
}
