const taskInput: HTMLInputElement = document.getElementById('taskInput');
const addTaskBtn: HTMLButtonElement = document.getElementById('addTaskBtn');
const taskList: HTMLUListElement = document.getElementById('taskList');
const clearCompletedBtn: HTMLButtonElement = document.getElementById('clearCompletedBtn');
const filterBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.filterBtn');

type Task = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
};

let tasks: Task[] = [];

function loadTasks(): void {
  const savedTasks: string | null = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

function saveTasks(): void {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(): void {
  const taskText: string = taskInput.value.trim();
  if (taskText) {
    const newTask: Task = {
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

function deleteTask(taskId: number): void {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function toggleTaskCompletion(taskId: number): void {
  const task: Task | undefined = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function clearCompletedTasks(): void {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function filterTasks(filter: string): void {
  let filteredTasks: Task[];
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

function renderTasks(tasksToRender: Task[] = tasks): void {
  taskList.innerHTML = '';
  tasksToRender.forEach(task => {
    const li: HTMLLIElement = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
      li.classList.add('completed');
    }

    const checkbox: HTMLInputElement = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const taskText: HTMLSpanElement = document.createElement('span');
    taskText.textContent = task.text;

    const deleteBtn: HTMLButtonElement = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    const createdAt: HTMLElement = document.createElement('small');
    createdAt.textContent = `Created: ${task.createdAt.toLocaleString()}`;

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    li.appendChild(createdAt);

    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    addTask();
  }
});
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterTasks(btn.dataset.filter as string);
  });
});

loadTasks();

function editTask(taskId: number): void {
  const task: Task | undefined = tasks.find(task => task.id === taskId);
  if (task) {
    const newText: string | null = prompt('Enter new task text:', task.text);
    if (newText !== null) {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
}

function sortTasks(sortBy: 'date' | 'alphabetical' | 'completed'): void {
  switch (sortBy) {
    case 'date':
      tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'alphabetical':
      tasks.sort((a, b) => a.text.localeCompare(b.text));
      break;
    case 'completed':
      tasks.sort((a, b) => Number(a.completed) - Number(b.completed));
      break;
  }
  renderTasks();
}

function getTasksStats(): { total: number; completed: number; active: number; completionRate: string } {
  const totalTasks: number = tasks.length;
  const completedTasks: number = tasks.filter(task => task.completed).length;
  const activeTasks: number = totalTasks - completedTasks;

  return {
    total: totalTasks,
    completed: completedTasks,
    active: activeTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) + '%' : '0%'
  };
}

function displayStats(): void {
  const stats = getTasksStats();
  console.log('Task Statistics:');
  console.log(`Total tasks: ${stats.total}`);
  console.log(`Completed: ${stats.completed}`);
  console.log(`Active: ${stats.active}`);
  console.log(`Completion rate: ${stats.completionRate}`);
}

function exportTasks(): void {
  const tasksJSON: string = JSON.stringify(tasks, null, 2);
  const blob: Blob = new Blob([tasksJSON], { type: 'application/json' });
  const url: string = URL.createObjectURL(blob);

  const a: HTMLAnchorElement = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();

  URL.revokeObjectURL(url);
}

function importTasks(file: File): void {
  const reader: FileReader = new FileReader();
  reader.onload = function(e: ProgressEvent<FileReader>) {
    try {
      const importedTasks: Task[] = JSON.parse(e.target?.result as string);
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