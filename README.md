# Todo List Application

This is a simple Todo List application built with HTML, CSS, and JavaScript. It allows users to add, delete, and manage tasks in their browser.

## Features

- Add new tasks
- Mark tasks as completed
- Delete tasks
- Filter tasks (All, Active, Completed)
- Clear all completed tasks
- Edit existing tasks
- Sort tasks by date, alphabetically, or completion status
- View task statistics
- Export and import tasks as JSON

## Installation

1. Clone this repository or download the files:
   - `index.html`
   - `main.js`

2. No additional installation is required. This application runs directly in your web browser.

## Usage

1. Open the `index.html` file in your web browser.
2. Use the input field to add new tasks.
3. Click on a task to mark it as completed.
4. Use the "Delete" button next to a task to remove it.
5. Use the filter buttons to view All, Active, or Completed tasks.
6. Click "Clear Completed" to remove all completed tasks.

## Advanced Features

- **Edit Task**: Double-click on a task to edit its text.
- **Sort Tasks**: Use the `sortTasks()` function in the console with 'date', 'alphabetical', or 'completed' as an argument.
- **View Statistics**: Call `displayStats()` in the console to see task statistics.
- **Export Tasks**: Call `exportTasks()` in the console to download tasks as a JSON file.
- **Import Tasks**: Implement a file input in HTML and connect it to the `importTasks()` function to upload tasks.

## Development

This application uses vanilla JavaScript and doesn't require any build steps. To modify the application:

1. Edit the JavaScript code in `main.js`.
2. Refresh the `index.html` page in your browser to see the changes.
