const API_BASE = 'http://localhost:3000/api';
const addTaskForm = document.getElementById('addTaskForm');
const taskListDiv = document.getElementById('taskList');
const logoutBtn = document.getElementById('logoutBtn');

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('choices').value;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, status }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error from server:', errorData);
      alert(errorData.error || 'Error adding task');
      return;
    }

    addTaskForm.reset();
    loadTasks();
  } catch (err) {
    alert('Server error');
    console.error(err);
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Status:", res.status); // ← ADD THIS
    const data = await res.json();
    console.log("Tasks from API:", data); // ← ADD THIS

    if (!res.ok) {
      alert('Failed to fetch tasks');
      return;
    }

    renderTasks(data);
  } catch (err) {
    console.error("Load error:", err);
    alert('Error loading tasks');
  }
}

function renderTasks(tasks) {
  taskListDiv.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task';
    div.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.description || ''}</p>
      <small>Status: ${task.status}</small><br/>
      <button onclick="toggleStatus('${task._id}', '${task.status}')">Change Status</button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;
    taskListDiv.appendChild(div);
  });
}

async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'Completed' ? 'Not Completed' : 'Completed';

  try {
    // Fetch the existing task first
    const getRes = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tasks = await getRes.json();
    const task = tasks.find(t => t._id === id);
    if (!task) {
      alert('Task not found');
      return;
    }

    // Send full task object with updated status
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: newStatus,
      }),
    });

    loadTasks();
  } catch (err) {
    alert('Error changing status');
    console.error(err);
  }
}
async function deleteTask(id) {
  try {
    await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    loadTasks();
  } catch (err) {
    alert('Error deleting task');
    console.error(err);
  }
}

window.toggleStatus = toggleStatus;
window.deleteTask = deleteTask;

loadTasks();