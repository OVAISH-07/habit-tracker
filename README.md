# 🌸 Habit Tracker

A simple, beautiful, and responsive habit tracker web app designed to help you build better habits, stay consistent, and understand your progress.

## ✨ Features

- 🔥 Habit streak tracking
- ➕ Add custom habits
- ✏️ Edit and delete habits
- 📝 Daily notes
- 📅 History & calendar
- 📊 Statistics & progress graphs
- 🏆 Achievements & badges
- 🌙 Dark mode
- 💾 Export & import backup
- 📱 Mobile responsive design
- ⚡ Progressive Web App (PWA)
- 📴 Offline support
- 💾 Data persistence using LocalStorage

## 🛠️ Built With

- **HTML5** — Application structure
- **CSS3** — Styling, responsive design, and dark mode
- **JavaScript** — Application logic and interactive features
- **LocalStorage** — Persistent habit and application data
- **Service Worker** — Offline functionality and caching
- **Web App Manifest** — PWA installation support

## 📱 Progressive Web App

Habit Tracker is built as a Progressive Web App.

It supports:

- Installation on supported devices
- Standalone app experience
- Offline usage
- Cached application files
- PWA icons
- Service Worker based caching

## 💾 Data & Privacy

Habit Tracker stores application data locally in the browser using **LocalStorage**.

No backend server or external database is required.

Your habit data remains on your device unless you choose to export it using the built-in backup feature.

## 📦 Backup & Restore

The application provides:

- **Export Backup** — Download your habit data as a JSON backup file.
- **Import Backup** — Restore your data from a previously exported backup.

This helps protect your data when changing browsers or devices.

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Open the project

Open the project folder in VS Code.

### 3. Run the application

Use a local development server such as **VS Code Live Server**.

Open the generated local URL in your browser.

> The application uses a Service Worker, so running it through a local server is recommended instead of opening `index.html` directly.

## 📁 Project Structure

```text
Habit Tracker/
│
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-192.png
│   └── icon-maskable-512.png
│
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
└── README.md
```

## 🎯 Project Goals

This project was built as a practical web development project to apply concepts including:

- DOM manipulation
- Event handling
- JavaScript data management
- LocalStorage
- Responsive CSS
- Data visualization
- PWA development
- Service Workers
- Offline-first functionality
- UI/UX design

## 🔮 Future Improvements

Possible future improvements include:

- Cloud synchronization
- User accounts
- Cross-device data synchronization
- More advanced analytics
- Additional customization options
- Notifications and reminders

## 👨‍💻 Creator

**Ovaish Ansari**

Computer Science Student & Developer

Built this project while learning web development and turning ideas into practical projects.

---

⭐ If you find this project useful, consider giving the repository a star.