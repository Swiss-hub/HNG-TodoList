const el = {
  card: document.querySelector('[data-testid="test-todo-card"]'),
  title: document.querySelector('[data-testid="test-todo-title"]'),
  description: document.querySelector('[data-testid="test-todo-description"]'),
  priorityBadge: document.querySelector('[data-testid="test-todo-priority"]'),
  priorityIndicator: document.querySelector('[data-testid="test-todo-priority-indicator"]'),
  statusBadge: document.querySelector('[data-testid="test-todo-status"]'),
  completeToggle: document.querySelector('[data-testid="test-todo-complete-toggle"]'),
  statusControl: document.querySelector('[data-testid="test-todo-status-control"]'),
  due: document.querySelector('[data-testid="test-todo-due-date"]'),
  remaining: document.querySelector('[data-testid="test-todo-time-remaining"]'),
  overdue: document.querySelector('[data-testid="test-todo-overdue-indicator"]'),
  expandToggle: document.querySelector('[data-testid="test-todo-expand-toggle"]'),
  collapsible: document.querySelector('[data-testid="test-todo-collapsible-section"]'),
  editBtn: document.querySelector('[data-testid="test-todo-edit-button"]'),
  deleteBtn: document.querySelector('[data-testid="test-todo-delete-button"]'),
  editSection: document.querySelector('[data-testid="test-todo-edit-form"]'),
  editForm: document.querySelector('#todo-edit-form'),
  editTitle: document.querySelector('[data-testid="test-todo-edit-title-input"]'),
  editDescription: document.querySelector('[data-testid="test-todo-edit-description-input"]'),
  editPriority: document.querySelector('[data-testid="test-todo-edit-priority-select"]'),
  editDue: document.querySelector('[data-testid="test-todo-edit-due-date-input"]'),
  saveBtn: document.querySelector('[data-testid="test-todo-save-button"]'),
  cancelBtn: document.querySelector('[data-testid="test-todo-cancel-button"]'),
};

function assertRequiredElements() {
  const missing = Object.entries(el)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(`Missing required element(s): ${missing.join(", ")}`);
  }
}

assertRequiredElements();

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Done"];
const DESCRIPTION_COLLAPSE_THRESHOLD = 140;

/** @type {{title:string, description:string, priority:"Low"|"Medium"|"High", status:"Pending"|"In Progress"|"Done", dueDate: Date}} */
let state = {
  title: el.title.textContent?.trim() || "Untitled task",
  description: el.description.textContent?.trim() || "",
  priority: PRIORITIES.includes(el.priorityBadge.textContent?.trim() || "")
    ? /** @type any */ (el.priorityBadge.textContent.trim())
    : "High",
  status: STATUSES.includes(el.statusBadge.textContent?.trim() || "")
    ? /** @type any */ (el.statusBadge.textContent.trim())
    : "In Progress",
  // Keep future due date by default; user can edit.
  dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
};

let editSnapshot = null;
let timeIntervalId = null;

function formatDueDate(d) {
  const formatted = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
  return `Due ${formatted}`;
}

function plural(n, unit) {
  return `${n} ${unit}${n === 1 ? "" : "s"}`;
}

function formatTimeRemaining(now, due) {
  const diffMs = due.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  const abs = Math.abs(diffMs);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (abs <= minute) return isOverdue ? "Overdue by 1 minute" : "Due now!";

  if (abs < hour) {
    const mins = Math.round(abs / minute);
    return isOverdue ? `Overdue by ${plural(mins, "minute")}` : `Due in ${plural(mins, "minute")}`;
  }

  if (abs < day) {
    const hours = Math.round(abs / hour);
    return isOverdue ? `Overdue by ${plural(hours, "hour")}` : `Due in ${plural(hours, "hour")}`;
  }

  const days = Math.round(abs / day);
  return isOverdue ? `Overdue by ${plural(days, "day")}` : `Due in ${plural(days, "day")}`;
}

function applyPriorityUI(priority) {
  el.priorityBadge.textContent = priority;
  el.priorityIndicator.classList.remove(
    "priority-indicator--low",
    "priority-indicator--medium",
    "priority-indicator--high"
  );

  if (priority === "Low") el.priorityIndicator.classList.add("priority-indicator--low");
  if (priority === "Medium") el.priorityIndicator.classList.add("priority-indicator--medium");
  if (priority === "High") el.priorityIndicator.classList.add("priority-indicator--high");
}

function applyStatusUI(status) {
  el.statusBadge.textContent = status;
  el.statusControl.value = status;

  const isDone = status === "Done";
  el.completeToggle.checked = isDone;
  el.card.classList.toggle("is-done", isDone);
}

function applyOverdueUI(isOverdue) {
  el.overdue.hidden = !isOverdue;
  el.card.classList.toggle("is-overdue", isOverdue);
}

function shouldCollapseDescription(description) {
  return (description || "").trim().length > DESCRIPTION_COLLAPSE_THRESHOLD;
}

function setCollapsed(isCollapsed) {
  el.collapsible.classList.toggle("is-collapsed", isCollapsed);
  el.expandToggle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  el.expandToggle.textContent = isCollapsed ? "Expand" : "Collapse";
}

function syncCollapseUI() {
  const longEnough = shouldCollapseDescription(state.description);
  // Keep the toggle always present for testability/keyboard flow.
  // Default: collapsed only when description is long.
  if (!el.expandToggle.dataset.userToggled) {
    setCollapsed(longEnough);
  }
}

function renderTime() {
  // If done, stop updates and show Completed.
  if (state.status === "Done") {
    el.due.textContent = formatDueDate(state.dueDate);
    el.due.setAttribute("datetime", state.dueDate.toISOString());
    el.remaining.textContent = "Completed";
    applyOverdueUI(false);
    return;
  }

  const now = new Date();
  el.due.textContent = formatDueDate(state.dueDate);
  el.due.setAttribute("datetime", state.dueDate.toISOString());

  const diffMs = state.dueDate.getTime() - now.getTime();
  const isOverdue = diffMs < 0;

  el.remaining.textContent = formatTimeRemaining(now, state.dueDate);
  el.remaining.setAttribute("datetime", now.toISOString());
  applyOverdueUI(isOverdue);
}

function startTimeUpdates() {
  if (timeIntervalId) {
    clearInterval(timeIntervalId);
    timeIntervalId = null;
  }
  renderTime();

  if (state.status === "Done") return;
  // Update every 30 seconds (meets 30–60 seconds requirement)
  timeIntervalId = setInterval(renderTime, 30 * 1000);
}

function openEditMode() {
  editSnapshot = structuredClone(state);
  el.editSection.hidden = false;
  el.editBtn.setAttribute("aria-expanded", "true");

  el.editTitle.value = state.title;
  el.editDescription.value = state.description;
  el.editPriority.value = state.priority;
  el.editDue.value = toDateTimeLocalValue(state.dueDate);

  // Keyboard flow: after Edit button, next tab lands inside the form.
  el.editTitle.focus();
}

function closeEditMode({ restoreFocus = true } = {}) {
  el.editSection.hidden = true;
  el.editBtn.setAttribute("aria-expanded", "false");
  if (restoreFocus) el.editBtn.focus();
  editSnapshot = null;
}

function toDateTimeLocalValue(d) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function parseDateTimeLocal(value) {
  // value like "2026-04-17T11:30"
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function applyStateToUI() {
  el.title.textContent = state.title;
  el.description.textContent = state.description;
  applyPriorityUI(state.priority);
  applyStatusUI(state.status);
  syncCollapseUI();
  startTimeUpdates();
}

// --- Event wiring ---

el.completeToggle.addEventListener("change", (e) => {
  const checked = /** @type {HTMLInputElement} */ (e.currentTarget).checked;
  // If checkbox toggled → status becomes Done; if unchecked after Done → Pending
  state.status = checked ? "Done" : "Pending";
  applyStateToUI();
});

el.statusControl.addEventListener("change", (e) => {
  const value = /** @type {HTMLSelectElement} */ (e.currentTarget).value;
  if (!STATUSES.includes(value)) return;
  state.status = /** @type any */ (value);

  // If status manually set to Done → checkbox checked
  // If status set away from Done → checkbox unchecked
  applyStateToUI();
});

el.expandToggle.addEventListener("click", () => {
  el.expandToggle.dataset.userToggled = "1";
  const expanded = el.expandToggle.getAttribute("aria-expanded") === "true";
  setCollapsed(expanded); // if expanded -> collapse; if collapsed -> expand
});

el.editBtn.addEventListener("click", () => {
  // Toggle edit mode
  if (!el.editSection.hidden) {
    closeEditMode();
    return;
  }
  openEditMode();
});

el.cancelBtn.addEventListener("click", () => {
  if (editSnapshot) {
    state = editSnapshot;
    applyStateToUI();
  }
  closeEditMode();
});

el.editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nextTitle = el.editTitle.value.trim() || "Untitled task";
  const nextDescription = el.editDescription.value.trim();
  const nextPriority = el.editPriority.value;
  const nextDueRaw = el.editDue.value;
  const nextDue = parseDateTimeLocal(nextDueRaw) || new Date(Date.now() + 60 * 60 * 1000);

  state.title = nextTitle;
  state.description = nextDescription;
  if (PRIORITIES.includes(nextPriority)) state.priority = /** @type any */ (nextPriority);
  state.dueDate = nextDue;

  applyStateToUI();
  closeEditMode();
});

el.deleteBtn.addEventListener("click", () => {
  alert("Delete clicked");
});

// Initial render
applyStateToUI();