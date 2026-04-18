// --- 1. LOGIN & SESSION LOGIC ---

function handleLogin() {
    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        showApp();
    } else {
        document.getElementById("login-error").style.display = "block";
    }
}

function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    location.reload(); 
}

function showApp() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-app").style.display = "block";
    updateStatus(); 
}

window.onload = function() {
    if (localStorage.getItem("isLoggedIn") === "true") {
        showApp();
    }
};

// --- 2. DATA MODELS ---

const PROJECTS = [
    { id: "p1", name: "Website Redesign" },
    { id: "p2", name: "Mobile App Development" },
    { id: "p3", name: "Database Migration" }
];

const PEOPLE = [
    { id: 1, name: "John", surname: "Doe", email: "john@tech.com", username: "jdoe77" },
    { id: 2, name: "Jane", surname: "Smith", email: "jane@tech.com", username: "jsmith88" },
    { id: 3, name: "Alex", surname: "Vance", email: "alex@tech.com", username: "avance99" }
];

// --- 3. STORAGE & ARCHITECT FUNCTIONS ---

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
    for (let i = 1; i <= 10; i++) {
        initialBugs.push({
            id: Date.now() + i,
            summary: "Issue " + i,
            description: "Detailed breakdown of bug number " + i,
            identifiedBy: "Admin",
            dateIdentified: "2023-10-01",
            project: PROJECTS[i % 3].name,
            assignedTo: PEOPLE[i % 3].username,
            status: i % 2 === 0 ? "open" : "resolved",
            priority: i % 3 === 0 ? "high" : "medium",
            targetDate: "2023-11-01",
            actualDate: "",
            resolutionSummary: ""
        });
    }
    saveToStorage("bugs", initialBugs);
    saveToStorage("people", PEOPLE);
    saveToStorage("projects", PROJECTS);
    displayData();
}

function clearDatabase() {
    localStorage.clear();
    displayData();
    updateStatus();
}

function displayData() {
    const bugs = getFromStorage("bugs");
    const display = document.getElementById("json-display");
    if(display) {
        display.innerText = JSON.stringify(bugs, null, 2);
    }
}

function updateStatus() {
    const status = document.getElementById("storage-status");
    if (status) {
        status.innerText = localStorage.length > 0 ? "Active (Data Loaded)" : "Empty";
        status.style.color = localStorage.length > 0 ? "green" : "red";
    }
}