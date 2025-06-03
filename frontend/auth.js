const API_BASE = 'http://localhost:3000/api';

const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Registration error');

    signupForm.reset(); 
  } catch (err) {
    alert('Server error');
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Login error');

    localStorage.setItem('token', data.token);
    window.location.href = 'todo.html';
  } catch (err) {
    alert('Server error');
  }
});
