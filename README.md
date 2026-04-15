# Task Card (Todo Card)

A simple, responsive **Todo Card** UI built with **HTML, CSS, and vanilla JavaScript**.

## Features

- Clean, responsive card layout
- Priority and status badges
- “Mark Complete” toggle (updates UI state)
- Due date + time remaining (auto-updates every 60 seconds)
- Edit/Delete actions (demo handlers)

## Project structure

```
Frontend/
  Task_Card/
    index.html
    styles.css
    main.js
```

## Run locally

### Option A: Open in browser (simplest)

1. Open `Task_Card/index.html` in any browser.

### Option B: Use a local dev server (recommended)

From the `Frontend` folder, run one of these:

- **VS Code / Cursor**: install “Live Server”, then right-click `Task_Card/index.html` → **Open with Live Server**
- **Node.js**:

```bash
npx serve .
```

Then open the URL shown in your terminal and navigate to `/Task_Card`.

## Notes

- Elements include `data-testid` attributes for easy UI testing.
- The due date is generated in JavaScript to always be in the near future (useful for demos).
