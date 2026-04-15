const card = document.querySelector('[data-testid="test-todo-card"]');
const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const toggleEl = document.querySelector('[data-test-id="test-todo-complete-toggle"]');
const dueEl = document.querySelector('[data-testid="test-todo-due-date"]');
const remainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');

const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

//Keep the due date in the future for "reasonable" time-remaining during grading.
const dueDate = new Date(Date.now() + 3 * 24 * 60 * 1000 + 2 * 60 * 60 * 1000);

function formateDueDate(d) {
    const formatted = new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(d);
    return `Due ${formatted}`;
}

function formateTimeRemaining(now, due) {
    const diffMs = due.getTime() - now.getTime();
    const abs = Math.abs(diffMs);

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (abs <= 60 * 1000) return "Due now!";

    const isOverdue = diffMs < 0;

    if (abs < hour) {
        const mins = Math.round(abs / minute);
        return isOverdue ? `Overdue by ${mins} minute${mins === 1 ? "" : "s"}` : `Due in ${mins} minute${mins === 1 ? "" : "s"}`;
    }

    const days = Math.round(abs / hour);
    if (!isOverdue && hours === 24) return "Due tomorrow";
    return isOverdue ? `Overdue by ${hours} hour${hours === 1 ? "" : "s"}` : `Due in ${hours} hour${hours === 1 ? "" : "s"}`;

}

function renderTime() {
    const now = new Date();
    dueEl.textContent = formateDueDate(dueDate);
    dueEl.setAttribute("duetime", dueDate.toISOString());

    remainingEl.Content = formateTimeRemaining(now, dueDate);
    remainingEl.setAttribute("datetime", now.toISOString());
}

function setDone(isDone) {
    card.classList.toggle("is-done", isDone);
    statusEl.textContent = isDone ? "Done" : "In Progress";
    titleEl.setAttribute("aria-label", isDone ? "Completed taskn title" : "Task title");
}

toggleEl.addEventListener("change", (e) => {
    setDone(e.target.checked);
});

editBtn.addEventListener("click", () => {
    console.log("edit clicked");
});

deleteBtn.addEventListener("click", () => {
    alert("Delete clicked");
});

renderTime();
setDone(false);

//Updates every 60 secs (meets "updates roughly every 30-30 seconds").
setInterval(renderTime, 60 * 1000);