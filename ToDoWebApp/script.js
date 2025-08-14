class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentTab = 'all';
        this.editingTaskId = null;
        
        this.initializeEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    initializeEventListeners() {
        // Add task
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Modal events
        document.getElementById('saveEdit').addEventListener('click', () => this.saveEdit());
        document.getElementById('cancelEdit').addEventListener('click', () => this.closeModal());
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') this.closeModal();
        });

        // Edit input enter key
        document.getElementById('editInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveEdit();
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        
        if (!text) {
            input.focus();
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        input.value = '';
        input.focus();
    }

    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.editingTaskId = taskId;
            document.getElementById('editInput').value = task.text;
            document.getElementById('editModal').style.display = 'block';
            document.getElementById('editInput').focus();
        }
    }

    saveEdit() {
        const newText = document.getElementById('editInput').value.trim();
        if (newText && this.editingTaskId) {
            const task = this.tasks.find(t => t.id === this.editingTaskId);
            if (task) {
                task.text = newText;
                this.saveTasks();
                this.renderTasks();
            }
        }
        this.closeModal();
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update sections
        document.querySelectorAll('.task-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${tab}-tasks`).classList.add('active');
        
        this.renderTasks();
    }

    renderTasks() {
        const allContainer = document.getElementById('allTasksList');
        const pendingContainer = document.getElementById('pendingTasksList');
        const completedContainer = document.getElementById('completedTasksList');

        // Clear containers
        [allContainer, pendingContainer, completedContainer].forEach(container => {
            container.innerHTML = '';
        });

        const allTasks = [...this.tasks];
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);

        // Render based on current tab
        if (this.currentTab === 'all') {
            this.renderTaskList(allTasks, allContainer);
        } else if (this.currentTab === 'pending') {
            this.renderTaskList(pendingTasks, pendingContainer);
        } else if (this.currentTab === 'completed') {
            this.renderTaskList(completedTasks, completedContainer);
        }
    }

    renderTaskList(tasks, container) {
        if (tasks.length === 0) {
            const emptyState = this.createEmptyState();
            container.appendChild(emptyState);
            return;
        }

        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        const createdTime = new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let completedInfo = '';
        if (task.completed && task.completedAt) {
            const completedDate = new Date(task.completedAt).toLocaleDateString();
            const completedTime = new Date(task.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            completedInfo = `<span>✅ Completed: ${completedDate} at ${completedTime}</span>`;
        }

        taskDiv.innerHTML = `
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                <div class="task-actions">
                    <button class="action-btn ${task.completed ? 'uncomplete-btn' : 'complete-btn'}" 
                            onclick="app.toggleComplete(${task.id})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="action-btn edit-btn" onclick="app.editTask(${task.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="app.deleteTask(${task.id})">Delete</button>
                </div>
            </div>
            <div class="task-meta">
                <span>📅 Created: ${createdDate} at ${createdTime}</span>
                ${completedInfo}
            </div>
        `;
        
        return taskDiv;
    }

    createEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        
        let message = '';
        switch(this.currentTab) {
            case 'all':
                message = '<h3>No tasks yet!</h3><p>Add your first task above to get started.</p>';
                break;
            case 'pending':
                message = '<h3>No pending tasks!</h3><p>Great job! All tasks are completed.</p>';
                break;
            case 'completed':
                message = '<h3>No completed tasks yet!</h3><p>Complete some tasks to see them here.</p>';
                break;
        }
        
        emptyDiv.innerHTML = message;
        return emptyDiv;
    }

    updateStats() {
        const total = this.tasks.length;
        const pending = this.tasks.filter(task => !task.completed).length;
        const completed = this.tasks.filter(task => task.completed).length;
        
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('completedCount').textContent = completed;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the app
const app = new TodoApp();
