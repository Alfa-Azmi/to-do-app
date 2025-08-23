// Smart API base URL detection - works in both Docker and development
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'  // Use this when developing locally
    : 'http://backend:5000';   // Use this when running in Docker

// Function to fetch and display tasks
async function loadTasks() {
    try {
        console.log("Connecting to API at:", `${API_BASE}/tasks`);
        const response = await fetch(`${API_BASE}/tasks`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tasks = await response.json();
        console.log("Tasks received:", tasks);
        
        const tasksContainer = document.getElementById('tasksList');
        tasksContainer.innerHTML = ''; // Clear existing tasks
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<p>No tasks found. Add one above!</p>';
            return;
        }
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-card';
            taskElement.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <button onclick="completeTask(${task.id})">Done</button>
            `;
            tasksContainer.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('tasksList').innerHTML = '<p>Error loading tasks. Make sure the backend is running.</p>';
    }
}

// Function to handle form submission
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    
    const newTask = {
        title: titleInput.value,
        description: descriptionInput.value
    };
    
    try {
        // Send the new task to the backend
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        
        if (response.ok) {
            // Clear the form and reload the task list
            titleInput.value = '';
            descriptionInput.value = '';
            loadTasks();
        } else {
            console.error('Failed to create task:', response.status);
            alert('Failed to create task. Please check if backend is running.');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Error creating task. Please check if backend is running.');
    }
});

// Function to mark a task as complete
async function completeTask(taskId) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}/complete`, { 
            method: 'POST' 
        });
        
        if (response.ok) {
            loadTasks(); // Reload the list to remove the completed task
        } else {
            console.error('Failed to complete task:', response.status);
            alert('Failed to complete task. Please try again.');
        }
    } catch (error) {
        console.error('Error completing task:', error);
        alert('Error completing task. Please try again.');
    }
}

// Load tasks when the page starts
loadTasks();