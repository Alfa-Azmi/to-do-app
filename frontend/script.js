// Smart API base URL detection - works in both Docker and development
function getApiBaseUrl() {
    // If we're running in development (opening file directly or through localhost)
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:') {
        
        // Use localhost for backend when developing locally
        return 'http://localhost:5000';
    }
    
    // For Docker environment - use backend service name
    return 'http://backend:5000';
}

const API_BASE = getApiBaseUrl();

// Load tasks from backend
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tasks = await response.json();
       
        const tasksContainer = document.getElementById('tasksList');
        tasksContainer.innerHTML = '';
       
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

// Handle form submission
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
   
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
   
    const newTask = {
        title: titleInput.value,
        description: descriptionInput.value
    };
   
    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
       
        if (response.ok) {
            titleInput.value = '';
            descriptionInput.value = '';
            loadTasks(); // Reload the tasks list
        } else {
            console.error('Failed to create task:', response.status);
        }
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Error creating task. Make sure the backend is running on port 5000.');
    }
});

// Mark task as complete
async function completeTask(taskId) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {
            method: 'POST'
        });
       
        if (response.ok) {
            loadTasks(); // Reload the tasks list
        } else {
            console.error('Failed to complete task:', response.status);
        }
    } catch (error) {
        console.error('Error completing task:', error);
    }
}

// Test backend connection on load
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        console.log('Backend connection successful');
    } catch (error) {
        console.warn('Backend connection failed:', error);
        console.log('API_BASE is:', API_BASE);
    }
}

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    testBackendConnection();
    loadTasks();
});