let temporarySubTasks = [];

function addSubTaskToList() {
    const subInput = document.getElementById("subTaskInput");
    const subText = subInput.value.trim();
    
    if (subText === "") return;
    
    temporarySubTasks.push(subText);
    
    const listContainer = document.getElementById("temporarySubTaskList");
    const li = document.createElement("li");
    li.textContent = "• " + subText;
    listContainer.appendChild(li);
    
    subInput.value = "";
}

function addTask() {
    const subjectSelect = document.getElementById("taskSubject");
    const typeSelect = document.getElementById("taskType");
    const dateInput = document.getElementById("taskDeadline");

    if (!subjectSelect.value || !dateInput.value) {
        alert("Mohon isi Mata Kuliah dan Tanggal Batas Pengumpulan!");
        return;
    }

    const fullTitle = `${subjectSelect.value} (${typeSelect.value || 'Tugas'})`;
    const deadlineDate = dateInput.value;

    createTaskElement(fullTitle, false, deadlineDate);

    subjectSelect.selectedIndex = 0;
    typeSelect.selectedIndex = 0;
    dateInput.value = "";
    temporarySubTasks = [];
    document.getElementById("temporarySubTaskList").innerHTML = "";

    saveData();
    updateProgress();
    updateSuggestion();
}