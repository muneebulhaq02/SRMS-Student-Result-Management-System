# SRMS — Student Result Management System

A simple web application built as a Student Result Management System for FAST-NUCES Karachi.

## Project Overview

- **Features**
  - Admin login and student login
  - Dashboard with summary statistics and recent performance
  - Student management with add/delete features
  - Course catalog and result entry
  - Student transcripts with GPA calculation and CSV export
  - Search, filtering, and ranking by department
- **Patterns used**
  - Singleton: Central `Store` data object
  - Factory: `RecordFactory` for creating student/course/result records
  - Observer: `EventBus` for view updates on data change
  - Strategy: Pluggable grading strategy
  - MVC-style separation for views and controllers

## Files

- `index.html` — main application layout and UI structure
- `style.css` — application styling and responsive layout
- `script.js` — application logic, authentication, data handling, and rendering

## How to Run

1. Open `index.html` in a web browser.
2. Use the credentials:
   - Admin: `admin` / `admin123`
   - Student example: `S001` / `123`

## GitHub Push Instructions

If this is a new Git repository, run the following commands in the project folder:

```bash
cd "g:/Fast_Courses/6th Semester/SE/PROJECT(2)"
git init
git add .
git commit -m "Add SRMS project files"
```

Then connect to your GitHub repository and push:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

Replace `<your-username>` and `<your-repo>` with your GitHub username and repository name.

## Notes

- All data is stored in-browser memory only, so changes are not persistent after a refresh.
- This project is intended as a demo for academic use and presentation.
