function addTask() {
      const input = document.getElementById("taskInput");
      const taskText = input.value;
      const taskDate = document.getElementById("taskDate").value;


      if (taskText === "") return;

      createTask(taskText, false, taskDate);

      input.value = "";

      updateProgress();
      updateSuggestion();
      saveData();
    }

    function updateProgress() {
      const tasks = document.querySelectorAll("#taskList li");
      const total = tasks.length;

      const done = document.querySelectorAll("#taskList input[type='checkbox']:checked").length;

      const percent = total === 0 ? 0 : Math.round((done / total) * 100);

      document.getElementById("progressBar").style.width = percent + "%";
      document.getElementById("progressText").textContent = "Progress: " + percent + "%";
      document.getElementById("dashboardProgressBar").style.width = percent + "%";
      document.getElementById("dashboardProgressText").textContent = "Progress: " + percent + "%";
    }

    function updateSuggestion(){
      const tasks = document.querySelectorAll("#taskList li");

      let nearestTask = null;
      let nearestDate = null;

      tasks.forEach((li) => {
        const checkbox = li.querySelector("input[type='checkbox']");
        const text = li.querySelector("span").textContent.trim();

        const small = li.querySelector("small");
        const dateText = small.textContent.replace("📅 ", "").trim();

        if (!checkbox.checked && dateText) {
          const taskDate = new Date(dateText);

          if (nearestDate === null || taskDate < nearestDate) {
            nearestDate = taskDate;
            nearestTask = text;
          }
        }
      });

      const box = document.getElementById("recommendationText");
      const deadlineBox = document.getElementById("nearestDeadline");

      if (nearestTask) {
        box.textContent = "🔥 Saran hari ini: kerjakan " + nearestTask;
        deadlineBox.textContent = nearestTask + " 📅";
      } else {
        box.textContent = "🔥 Semua tugas selesai✨";
        deadlineBox.textContent = "Tidak ada deadline";
      }
    }

    function saveData() {
      const tasks = [];
      document.querySelectorAll("#taskList li").forEach((li) => {
        const text = li.querySelector("span").textContent.trim();
        const done = li.querySelector("input").checked;
        
        const date = li.querySelector("small")?.textContent.replace("📅 ", "") || "";
        tasks.push({ text, done, date});
      });

      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadData() {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
      const data = JSON.parse(localStorage.getItem("tasks")) || [];

      data.forEach((task) => {
        createTask(task.text, task.done, task.date);
      });

    }

    function createTask(taskText, isDone = false, taskDate = "") {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isDone;

        const span = document.createElement("span");
        span.textContent = " " + taskText;
        const dateText = document.createElement("small");
        dateText.textContent = "📅 " + taskDate;

        if (isDone) {
          span.style.textDecoration = "line-through";
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Hapus";

        checkbox.onclick = function () {
          span.style.textDecoration = checkbox.checked ? "line-through" : "none";
          updateProgress();
          updateSuggestion();
          saveData();
        };

        deleteBtn.onclick = function () {
          li.remove();

          updateProgress();
          updateSuggestion();
          saveData();
        };

        const left = document.createElement("div");
        left.appendChild(checkbox);
        left.appendChild(span);
        left.appendChild(dateText);

        const right = document.createElement("div");
        right.appendChild(deleteBtn);

        li.appendChild(left);
        li.appendChild(right);

        document.getElementById("taskList").appendChild(li);
      }

      const today = new Date();

      const options = {
        weekday: "long",
        day: "numeric:",
        month: "long",
        year: "numeric"
      };
      document.getElementById("todayDate").textContent = today.toLocaleDateString("id-ID", options);
      today.toLocaleDateString("id-ID", options);

    function showPage(page) {
      document.getElementById("dashboardPage").style.display = "none";
      document.getElementById("taskPage").style.display = "none";
      document.getElementById("calendarPage").style.display = "none";

      if (page === "dashboard"){
        document.getElementById("dashboardPage").style.display = "block";
      }

      if (page === "tasks") {
        document.getElementById("taskPage").style.display = "block";
      }

      if (page === "calendar") {
        document.getElementById("calendarPage").style.display = "block";
      }
    }

    const monthYear = document.getElementById("monthYear");
    const calendarGrid = document.getElementById("calendarGrid");

    let currentMonth = new Date();

    function renderCalendar() {

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const today = new Date();

        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
            "Agustus", "September", "Oktober", "November", "Desember"
        ];

        monthYear.textContent = `${monthNames[month]} ${year}`;

        calendarGrid.innerHTML = "";

        for (let i = 0; i < firstDay; i++) {
            calendarGrid.innerHTML += `<div></div>`;
        }

        for (let day = 1; day <= lastDate; day++) {
            const dateBox = document.createElement("div");

            dateBox.textContent = day;

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dateBox.classList.add("today");
            }

            calendarGrid.appendChild(dateBox);
        }
    }

    document.getElementById("prevMonth").onclick = () => {
        currentDate.setMonth(currentDate.getMonth() -1);
        renderCalendar();
    };

    document.getElementById("nextMonth").onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };

    renderCalendar();

    loadData();
    updateProgress();
    updateSuggestion();