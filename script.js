// --- 1. DATA MODELS (The "Shapes" of your data) ---

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

// --- 2. STORAGE ENGINE (Helper Functions) ---

// Save any data to localStorage
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    updateStatus();
}

// Get any data from localStorage
function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// --- 3. ARCHITECT ACTIONS ---

function seedDatabase() {
    // Creating a sample Bug list (10 items as required by rubric)
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
    document.getElementById("json-display").innerText = JSON.stringify(bugs, null, 2);
}

function updateStatus() {
    const status = document.getElementById("storage-status");
    status.innerText = localStorage.length > 0 ? "Active (Data Loaded)" : "Empty";
    status.style.color = localStorage.length > 0 ? "green" : "red";
}

// Initialize on load
updateStatus();