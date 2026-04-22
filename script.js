
'use strict';

// ============================================
// ARCHITECT (Data & Infrastructure)
// ============================================

// --- Session Management ---
function handleLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === 'admin' && pass === '1234') {
        sessionStorage.setItem('isLoggedIn', 'true');
        showApp();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}


function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    location.reload();
}


function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    updateStatus();
    populatePeopleDropdown();
    initNavigator();
}

window.onload = function() {
     if (sessionStorage.getItem('isLoggedIn') === 'true') {
    //if (localStorage.getItem('isLoggedIn') === 'true') {
        showApp();
    }
};

// --- Data Models ---
const PROJECTS = [
    { id: 'p1', name: 'Frontend Redesign 2026' },
    { id: 'p2', name: 'API Migration v2' },
    { id: 'p3', name: 'Mobile App - React Native' },
    { id: 'p4', name: 'Database Optimization' }
];

const PEOPLE = [
    { id: 1, name: 'Marcus', surname: 'Chen', email: 'marcus.c@devflow.io', username: 'mchen' },
    { id: 2, name: 'Sarah', surname: 'Johnson', email: 'sarah.j@devflow.io', username: 'sjohnson' },
    { id: 3, name: 'David', surname: 'Kim', email: 'david.k@devflow.io', username: 'dkim' },
    { id: 4, name: 'Elena', surname: 'Rodriguez', email: 'elena.r@devflow.io', username: 'erodriguez' }
];

// --- Storage Functions ---
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    updateStatus();
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function seedDatabase() {
    const initialBugs = [];
    const statuses = ['open', 'resolved', 'open', 'overdue'];
    const priorities = ['low', 'medium', 'high', 'medium'];
    const descriptions = [
        'Login button unresponsive on Safari',
        'Dashboard charts not loading after refresh',
        'API timeout when fetching large datasets',
        'Mobile navigation menu overlaps content',
        'Dark mode toggle not persisting state',
        'Form validation error on email field',
        'WebSocket connection dropping frequently',
        'Image upload failing for PNG files',
        'Search results pagination broken',
        'Notification badge count incorrect'
    ];
    
    for (let i = 1; i <= 10; i++) {
        const createdDate = new Date(2026, 2, i);
        const targetDate = new Date(2026, 3, i + 5);
        
        initialBugs.push({
            id: Date.now() + i,
            summary: `BUG-2026-${String(i).padStart(3, '0')}: ${descriptions[i-1]}`,
            description: `${descriptions[i-1]}. This issue affects users on multiple browsers and requires investigation.`,
            identifiedBy: ['QA Team', 'User Report', 'Dev Team'][i % 3],
            dateIdentified: createdDate.toISOString().split('T')[0],
            project: PROJECTS[i % 4].name,
            assignedTo: PEOPLE[i % 4].username,
            status: statuses[i % 4],
            priority: priorities[i % 4],
            targetDate: targetDate.toISOString().split('T')[0],
            actualDate: i % 2 === 0 ? new Date(2026, 3, i).toISOString().split('T')[0] : '',
            resolutionSummary: i % 2 === 0 ? 'Fixed and deployed to production.' : ''
        });
    }
    
    saveToStorage('bugs', initialBugs);
    saveToStorage('people', PEOPLE);
    saveToStorage('projects', PROJECTS);
    displayData();
    renderDashboard();
}

function clearDatabase() {
    localStorage.removeItem('bugs');
    localStorage.removeItem('people');
    localStorage.removeItem('projects');//we did not use localstorage.clear because then the user might get logged out unexpectedly
    displayData();
    updateStatus();
    renderDashboard();
}

function displayData() {
    const bugs = getFromStorage('bugs');
    const display = document.getElementById('json-display');
    if (display) {
        display.innerText = JSON.stringify(bugs, null, 2);
    }
}

function updateStatus() {
    const status = document.getElementById('storage-status');
    if (status) {
        const bugCount = getFromStorage('bugs').length;
        status.innerText = `${bugCount} issues`;
        status.style.color = bugCount > 0 ? '#6e8cff' : '#ff6b6b';
    }
}

// ============================================
// TRACKER (Forms & Logic)
// ============================================



function populatePeopleDropdown() {
    const people = getFromStorage('people');
    const source = people.length > 0 ? people : PEOPLE;// fallback to hardcoded data if storage is empty
    const dropdown = document.getElementById('assignedTo');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select team member...</option>';
    source.forEach(person => {
        const option = document.createElement('option');
        option.value = person.username;
        option.textContent = `${person.name} ${person.surname} (${person.username})`;
        dropdown.appendChild(option);
    });
}

function createIssue() {
    const summary = document.getElementById('summary').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority = document.getElementById('priority').value;
    const targetDate = document.getElementById('targetDate').value;
    const assignedTo = document.getElementById('assignedTo').value;
    
    if (!summary || !targetDate) {
        document.getElementById('form-error').style.display = 'block';
        return;
    }
    
    document.getElementById('form-error').style.display = 'none';
    const bugs = getFromStorage('bugs');
    
    const newBug = {
        id: Date.now(),
        summary: summary,
        description: description,
        identifiedBy: 'Admin',
        dateIdentified: new Date().toISOString().split('T')[0],
        project: 'Frontend Redesign 2026',
        assignedTo: assignedTo,
        status: 'open',
        priority: priority || 'medium',
        targetDate: targetDate,
        actualDate: '',
        resolutionSummary: ''
    };
    
    bugs.push(newBug);
    saveToStorage('bugs', bugs);
    displayData();
    clearForm();
    renderDashboard();
}

function clearForm() {
    document.getElementById('summary').value = '';
    document.getElementById('description').value = '';
    document.getElementById('priority').value = '';
    document.getElementById('targetDate').value = '';
    document.getElementById('assignedTo').value = '';
}

function reassignIssue(issueId, newUser) {
    const bugs = getFromStorage('bugs');
    const updatedBugs = bugs.map(bug => {
        if (bug.id === issueId) bug.assignedTo = newUser;
        return bug;
    });
    saveToStorage('bugs', updatedBugs);
    displayData();
}

// ============================================
// NAVIGATOR (Dashboard & Views)
// ============================================

let navigatorReady = false;

function initNavigator() {
    if (navigatorReady) return;
    hookNavigatorEvents();
    renderDashboard();
    navigatorReady = true;
}

function loadNavigatorData() {
    const bugs = getFromStorage('bugs');
    const people = getFromStorage('people');
    
    const bugsWithOverdue = applyOverdueLogic(bugs);
    
    const peopleByUsername = {};
    (people || []).forEach(p => peopleByUsername[p.username] = p);
    
    return { bugs: bugsWithOverdue, peopleByUsername };
}

function getFilteredBugs(bugs) {
    const s = (document.getElementById('nav-status')?.value || '').toLowerCase();
    const p = (document.getElementById('nav-priority')?.value || '').toLowerCase();
    const q = (document.getElementById('nav-search')?.value || '').toLowerCase();
    
    return bugs.filter(b => {
        const okStatus = !s || String(b.status || '').toLowerCase() === s;
        const okPriority = !p || String(b.priority || '').toLowerCase() === p;
        const hay = `${b.summary || ''} ${b.description || ''}`.toLowerCase();
        const okSearch = !q || hay.includes(q);
        return okStatus && okPriority && okSearch;
    });
}

function renderDashboard() {
    const { bugs, peopleByUsername } = loadNavigatorData();
    
    const tbody = document.getElementById('nav-tbody');
    const empty = document.getElementById('nav-empty');
    const list = document.getElementById('nav-list');
    const detail = document.getElementById('nav-detail');
    
    if (!tbody) return;
    
    if (list) list.style.display = 'block';
    if (detail) detail.style.display = 'none';
    
    const filtered = getFilteredBugs(bugs);
    tbody.innerHTML = '';
    
    if (!filtered.length) {
        if (empty) empty.style.display = 'block';
        if (tbody) tbody.innerHTML = '';
        return;
    }
    
    if (empty) empty.style.display = 'none';
    
    filtered.forEach(b => {
        const person = b.assignedTo ? peopleByUsername[b.assignedTo] : null;
        const assignedText = person ? `${person.name} ${person.surname}` : (b.assignedTo || 'Unassigned');
        
        const item = document.createElement('div');
        item.className = 'issue-item';
        item.innerHTML = `
            <div class="issue-header">
                <span class="issue-title">${escapeHtml(b.summary || '—')}</span>
                ${statusBadge(b.status)}
            </div>
            <div class="issue-meta">
                <span>👤 ${escapeHtml(assignedText)}</span>
                <span>📁 ${escapeHtml(b.project || '—')}</span>
                <span>📅 ${escapeHtml(b.targetDate || '—')}</span>
            </div>
            <div class="issue-footer">
                ${priorityBadge(b.priority)}
                <div>
                    <button class="btn-action" onclick="showIssueDetail('${b.id}')">View</button>
                    <button class="btn-action" onclick="openEditModal('${b.id}')">Edit</button>
                </div>
            </div>
        `;
        tbody.appendChild(item);
    });
}

function showIssueDetail(id) {
    const { bugs, peopleByUsername } = loadNavigatorData();
    const bug = bugs.find(b => String(b.id) === String(id));
    if (!bug) return;
    
    const list = document.getElementById('nav-list');
    const detail = document.getElementById('nav-detail');
    const content = document.getElementById('nav-detail-content');
    
    if (list) list.style.display = 'none';
    if (detail) detail.style.display = 'block';
    
    const person = bug.assignedTo ? peopleByUsername[bug.assignedTo] : null;
    const assignedText = person ? `${person.name} ${person.surname} (${person.username})` : (bug.assignedTo || 'Unassigned');
    
    content.innerHTML = `
        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
            ${statusBadge(bug.status)}
            ${priorityBadge(bug.priority)}
            <span class="badge" style="background: #1e2748; color: #8892b0;">ID: ${escapeHtml(bug.id)}</span>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Summary</div>
            <div class="detail-value">${escapeHtml(bug.summary || '—')}</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Description</div>
            <div class="detail-value">${escapeHtml(bug.description || '—')}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="detail-section">
                <div class="detail-label">Identified By</div>
                <div class="detail-value">${escapeHtml(bug.identifiedBy || '—')}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">Date Identified</div>
                <div class="detail-value">${escapeHtml(bug.dateIdentified || '—')}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">Project</div>
                <div class="detail-value">${escapeHtml(bug.project || '—')}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">Assigned To</div>
                <div class="detail-value">${escapeHtml(assignedText)}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">Target Date</div>
                <div class="detail-value">${escapeHtml(bug.targetDate || '—')}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">Actual Resolution</div>
                <div class="detail-value">${escapeHtml(bug.actualDate || 'Pending')}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Resolution Summary</div>
            <div class="detail-value">${escapeHtml(bug.resolutionSummary || 'Not resolved yet')}</div>
        </div>
        
        <div style="margin-top: 20px;">
            <button class="btn-primary-custom" style="width: auto; padding: 10px 24px;" onclick="openEditModal('${bug.id}')">
                ✏️ Edit Issue
            </button>
        </div>
    `;
}

function hookNavigatorEvents() {
    document.getElementById('nav-refresh')?.addEventListener('click', renderDashboard);
    document.getElementById('nav-back')?.addEventListener('click', renderDashboard);
    ['nav-status', 'nav-priority', 'nav-search'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', renderDashboard);
    });
}

function escapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function statusBadge(status) {
    const s = String(status || 'unknown').toLowerCase();
    const cls = s === 'open' ? 'badge-open' : s === 'resolved' ? 'badge-resolved' : s === 'overdue' ? 'badge-overdue' : '';
    const icon = s === 'open' ? '🔵' : s === 'resolved' ? '✅' : s === 'overdue' ? '🔴' : '⚪';
    return `<span class="badge ${cls}">${icon} ${escapeHtml(s)}</span>`;
}

function priorityBadge(priority) {
    const p = String(priority || 'unknown').toLowerCase();
    const cls = p === 'low' ? 'badge-low' : p === 'medium' ? 'badge-medium' : p === 'high' ? 'badge-high' : '';
    const icon = p === 'low' ? '🟢' : p === 'medium' ? '🟡' : p === 'high' ? '🔴' : '⚪';
    return `<span class="badge ${cls}">${icon} ${escapeHtml(p)}</span>`;
}

// ============================================
// EDITOR (Updates & UI/UX)
// ============================================

// Automatically marks issues as "overdue" if they're past their target date
function applyOverdueLogic(bugs) {
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    
    return bugs.map(bug => {
        if (bug.status === 'open' && bug.targetDate && bug.targetDate < today) {
            return { ...bug, status: 'overdue' }; // Mark as overdue
        }
        return bug; 
    });
}

//Populates and displays the edit modal with existing issue data
function openEditModal(id) {
    const bugs = getFromStorage('bugs');
    const bug = bugs.find(b => String(b.id) === String(id));
    if (!bug) return;
    
    document.getElementById('edit-id').value = bug.id;
    document.getElementById('edit-summary').value = bug.summary || '';
    document.getElementById('edit-description').value = bug.description || '';
    document.getElementById('edit-resolution').value = bug.resolutionSummary || '';
    document.getElementById('edit-status').value = bug.status || 'open';
    document.getElementById('edit-priority').value = bug.priority || 'medium';
    document.getElementById('edit-targetDate').value = bug.targetDate || '';
    document.getElementById('edit-actualDate').value = bug.actualDate || '';
    
    const people = getFromStorage('people');
    const dropdown = document.getElementById('edit-assignedTo');
    dropdown.innerHTML = '<option value="">Select team member...</option>';
    
    people.forEach(person => {
        const option = document.createElement('option');
        option.value = person.username;
        option.textContent = `${person.name} ${person.surname}`;
        if (person.username === bug.assignedTo) option.selected = true;
        dropdown.appendChild(option);
    });
    
    //Show the modal using Bootstrap
    
    const modal = new bootstrap.Modal(document.getElementById('editIssueModal'));
    modal.show();
}

//Saves the edited issue back to storage and updates the dashboard  
function saveEditedIssue() {
    const id = document.getElementById('edit-id').value;
    const bugs = getFromStorage('bugs');
    
    const bugIndex = bugs.findIndex(b => String(b.id) === String(id));
    if (bugIndex === -1) return;
    
    bugs[bugIndex] = {
        ...bugs[bugIndex],
        summary: document.getElementById('edit-summary').value,
        description: document.getElementById('edit-description').value,
        resolutionSummary: document.getElementById('edit-resolution').value,
        status: document.getElementById('edit-status').value,
        priority: document.getElementById('edit-priority').value,
        assignedTo: document.getElementById('edit-assignedTo').value,
        targetDate: document.getElementById('edit-targetDate').value,
        actualDate: document.getElementById('edit-actualDate').value
    };
    
    if (bugs[bugIndex].status === 'resolved' && !bugs[bugIndex].actualDate) {
        bugs[bugIndex].actualDate = new Date().toISOString().split('T')[0];
    }
    
    saveToStorage('bugs', bugs);
    displayData();
    renderDashboard();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editIssueModal'));
    modal.hide();
}

console.log('🐛 BugTracker v2.0 - All systems operational');
