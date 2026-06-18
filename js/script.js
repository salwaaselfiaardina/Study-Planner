function saveData() {
    const tasks = [];
    const taskItems = document.querySelectorAll(".task-item-new");
    
    taskItems.forEach((item) => {
        const title = item.querySelector("h4").textContent.trim();
        const done = item.querySelector("input[type='checkbox']").checked;
        const date = item.querySelector(".item-right span").textContent.replace("📅 ", "").trim();
        tasks.push({ title, done, date });
    });
    localStorage.setItem("study_planner_tasks", JSON.stringify(tasks));
}

function loadData() {
    const wrapper = document.querySelector(".task-list-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("study_planner_tasks")) || [];

    data.forEach((task) => {
        createTaskElement(task.title, task.done, task.date);
    });
}

function createTaskElement(title, isDone, date) {
    const wrapper = document.querySelector(".task-list-wrapper");
    if (!wrapper) return;

    const taskItem = document.createElement("div");
    taskItem.className = "task-item-new";

    taskItem.innerHTML = `
        <div class="item-left">
            <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskStatus(this)">
            <div class="item-info">
                <h4 style="${isDone ? 'text-decoration: line-through;' : ''}">${title}</h4>
                <a href="task-detail.html" class="sub-link">Lainnya</a>
            </div>
        </div>
        <div class="item-right">
            <span>📅 ${date}</span>
            <button class="delete-btn" onclick="deleteTaskElement(this)">Hapus</button>
        </div>
    `;
    wrapper.appendChild(taskItem);
}

function toggleTaskStatus(checkbox) {
    const titleText = checkbox.nextElementSibling.querySelector("h4");
    if (checkbox.checked) {
        titleText.style.textDecoration = "line-through";
    } else {
        titleText.style.textDecoration = "none";
    }
    saveData();
    updateProgress();
}

function deleteTaskElement(button) {
    button.closest(".task-item-new").remove();
    saveData();
    updateProgress();
    updateSuggestion();
}

function updateProgress() {
    const data = JSON.parse(localStorage.getItem("study_planner_tasks")) || [];
    const total = data.length;
    const done = data.filter(t => t.done).length;
    
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    const progressFill = document.querySelector(".progress-fill");
    const progressText = document.querySelector(".progress-text");

    if (progressFill) progressFill.style.width = percent + "%";
    if (progressText) progressText.textContent = percent + "%";
}

function updateSuggestion() {
    const data = JSON.parse(localStorage.getItem("study_planner_tasks")) || [];
    const container = document.querySelector(".recommendation-list");
    if (!container) return;

    container.innerHTML = "";
    
    
    const unfinishedTasks = data.filter(t => !t.done);

    
    if (unfinishedTasks.length === 0) {
        container.innerHTML = `
            <div class="rec-item" style="justify-content: center;">
                <span style="font-weight: 500; color: #666;">🎉 Semua tugas selesai! Kamu bebas rebahan.</span>
            </div>
        `;
        return;
    }

    
    unfinishedTasks.sort((a, b) => new Date(a.date) - new Date(b.date));

    
    unfinishedTasks.slice(0, 3).forEach(task => {
        const recItem = document.createElement("div");
        recItem.className = "rec-item";
        
        
        recItem.innerHTML = `
            <span style="text-align: left; flex: 1; padding-right: 15px; font-weight: 500; color: #333;">
                Kerjakan tugas ${task.title} (Batas pengumpulan: ${task.date})
            </span>
            <a href="task-detail.html" class="more-btn">Lainnya</a>
        `;
        container.appendChild(recItem);
    });
}

function inisialisasiDashboard() {
    const dateElement = document.getElementById('currentDashboardDate');
    const nameElement = document.getElementById('userWelcomeName');
    
    if (dateElement) {
        const hariIni = new Date();
        const opsi = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerText = hariIni.toLocaleDateString('id-ID', opsi);
    }
    if (nameElement) {
        nameElement.innerText = localStorage.getItem("user_nama") || "Salwa";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    inisialisasiDashboard();
    loadData();
    updateProgress();
    updateSuggestion();
});