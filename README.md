# Task Card (Todo Card)

A simple, responsive **Todo Card** UI built with **HTML, CSS, and vanilla JavaScript**.

## Features

### Stage 0
- Clean, responsive card layout
- Priority and status badges
- “Mark Complete” checkbox (updates UI state)
- Due date + time remaining
- Edit/Delete actions (demo handlers)

### Stage 1a (Advanced Todo Card)
- **Edit mode** (Edit → Save/Cancel) with labeled fields
- **Status control** dropdown (`Pending`, `In Progress`, `Done`) kept in sync with the checkbox + status badge
- **Priority indicator** (colored dot) that changes with `Low/Medium/High`
- **Expand/Collapse** description when it’s long (keyboard accessible + `aria-expanded`)
- **Overdue indicator** shown when due date passes
- **Time remaining updates every 30 seconds**
- When status becomes **Done**, time remaining stops updating and shows **Completed**

### Stage 1b (Profile Card)
- **Semantic profile card** (`article`, `figure`, `nav`, sections, lists)
- **Current time in milliseconds** (`Date.now()`), refreshed about every 750ms, with `aria-live="polite"`
- **Avatar** with meaningful `alt`; optional **image upload** updates the displayed photo
- **Social links** in one container (`test-user-social-links`) plus per-network test ids
- **Hobbies** and **dislikes** as separate lists
- **Responsive**: stacked on small screens; avatar + content side-by-side from tablet up

## Project structure

```
HNG-TodoList/
  Task_Card/
    index.html
    styles.css
    main.js
  Task_Profile/
    index.html
    styles.css
    main.js
```

## Run locally

### Option A: Open in browser (simplest)

1. Open `Task_Card/index.html` or `Task_Profile/index.html` in any browser.

### Option B: Use a local dev server (recommended)

From the repo root (`HNG-TodoList`), run one of these:

- **VS Code / Cursor**: install “Live Server”, then right-click `Task_Card/index.html` or `Task_Profile/index.html` → **Open with Live Server**
- **Node.js**:

```bash
npx serve .
```

Then open the URL shown in your terminal and navigate to `/Task_Card` or `/Task_Profile`.

### GitHub Pages

If Pages is configured for the repo root, typical URLs are:

- Todo card: `https://<user>.github.io/<repo>/Task_Card/`
- Profile card: `https://<user>.github.io/<repo>/Task_Profile/`

## Notes

- Elements include `data-testid` attributes for easy UI testing.
- The due date is generated in JavaScript to always be in the near future (useful for demos).
- Accessibility notes:
  - Real checkbox + label for completion
  - Status dropdown has an accessible name
  - Expand toggle uses `aria-expanded` + `aria-controls`
  - Time remaining uses `aria-live="polite"`
