// script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            removeTask(e.target.parentElement);
        } else if (e.target.classList.contains('edit')) {
            editTask(e.target.parentElement);
        } else if (e.target.classList.contains('toggle')) {
            toggleTask(e.target.parentElement);
        }
    });

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            createTaskElement(task);
        });
    }

    function addTask(task) {
        if (task.trim() === '') return;

        const taskObj = {
            text: task,
            completed: false
        };
        createTaskElement(taskObj);
        saveTaskToLocalStorage(taskObj);
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit">Edit</button>
            <button class="toggle">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete">Delete</button>
        `;
        taskList.appendChild(li);
    }

    function removeTask(taskElement) {
        taskElement.remove();
        removeTaskFromLocalStorage(taskElement);
    }

    function editTask(taskElement) {
        const taskText = taskElement.querySelector('.task');
        const newText = prompt('Edit Task:', taskText.textContent);
        if (newText !== null && newText.trim() !== '') {
            taskText.textContent = newText;
            updateTaskInLocalStorage(taskElement, newText);
        }
    }

    function toggleTask(taskElement) {
        const taskText = taskElement.querySelector('.task');
        taskText.classList.toggle('completed');
        taskElement.querySelector('.toggle').textContent = taskText.classList.contains('completed') ? 'Undo' : 'Complete';
        updateTaskStatusInLocalStorage(taskElement);
    }

    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTaskToLocalStorage(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskElement) {
        const tasks = getTasksFromLocalStorage();
        const taskText = taskElement.querySelector('.task').textContent;
        const updatedTasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function updateTaskInLocalStorage(taskElement, newText) {
        const tasks = getTasksFromLocalStorage();
        const taskText = taskElement.querySelector('.task').textContent;
        const updatedTasks = tasks.map(task => {
            if (task.text === taskText) {
                task.text = newText;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function updateTaskStatusInLocalStorage(taskElement) {
        const tasks = getTasksFromLocalStorage();
        const taskText = taskElement.querySelector('.task').textContent;
        const updatedTasks = tasks.map(task => {
            if (task.text === taskText) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});
