const API_BASE = 'http://localhost:5000';

// Load tasks from backend
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
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
        }
    } catch (error) {
        console.error('Error creating task:', error);
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
        }
    } catch (error) {
        console.error('Error completing task:', error);
    }
}

// Load tasks when page loads
loadTasks();