
// DOM Elements
const dateTimeElement = document.getElementById('date-time');
const themeToggle = document.getElementById('theme-toggle');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const notesArea = document.getElementById('notes-area');
const notesSave = document.getElementById('notes-save');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const musicTitle = document.getElementById('music-title');
const musicProgressBar = document.getElementById('music-progress-bar');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteRefresh = document.getElementById('quote-refresh');
const greeting = document.querySelector('.greeting');

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    
    // Update greeting based on time of day
    const hour = now.getHours();
    let greetingText = 'Good morning';
    
    if (hour >= 12 && hour < 17) {
        greetingText = 'Good afternoon';
    } else if (hour >= 17) {
        greetingText = 'Good evening';
    }
    
    const name = localStorage.getItem('studentName') || 'Student';
    greeting.textContent = `${greetingText}, ${name}`;

    // Ask for name if not set
    if (!localStorage.getItem('studentName')) {
        setTimeout(() => {
            const name = prompt('What is your name?', '');
            if (name) {
                localStorage.setItem('studentName', name);
                greeting.textContent = `${greetingText}, ${name}`;
            }
        }, 1000);
    }
}

// Initial update and set interval
updateDateTime();
setInterval(updateDateTime, 60000); // Update every minute

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Toggle icon
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// Check saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Todo List Functionality
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(index));
        
        const text = document.createElement('span');
        text.className = `todo-text ${todo.completed ? 'todo-completed' : ''}`;
        text.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', () => deleteTodo(index));
        
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        
        todoList.appendChild(li);
    });
}

function addTodo(text) {
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
});

// Initial render
renderTodos();

// Notes Functionality
notesArea.value = localStorage.getItem('notes') || '';

notesSave.addEventListener('click', () => {
    localStorage.setItem('notes', notesArea.value);
    notesSave.textContent = 'Saved!';
    setTimeout(() => {
        notesSave.textContent = 'Save Notes';
    }, 2000);
});

// Music Player
const musicTracks = [
    { title: "Lofi Study Beats", src: "" },
    { title: "Ambient Focus", src: "" },
    { title: "Deep Concentration", src: "" },
    { title: "Calm Piano", src: "" }
];

let currentTrack = 0;

function updateMusicUI() {
    musicTitle.textContent = musicTracks[currentTrack].title;
}

playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + musicTracks.length) % musicTracks.length;
    updateMusicUI();
});

nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % musicTracks.length;
    updateMusicUI();
});

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    musicProgressBar.style.width = `${progress || 0}%`;
});

updateMusicUI();

// Motivational Quotes
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
];

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = `"${quotes[randomIndex].text}"`;
    quoteAuthor.textContent = `— ${quotes[randomIndex].author}`;
}

quoteRefresh.addEventListener('click', displayRandomQuote);
displayRandomQuote(); // Initial quote
