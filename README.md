# Hina - Desktop Productivity App

**Hina** is an AI-powered desk companion — a desktop productivity app that helps you manage tasks, focus timers, habits, and workspace organization. Built with Electron, React, and TypeScript, it runs on Windows, Mac, and Linux.

## Features

✨ **Task Management** - Create, track, and complete tasks with priorities and deadlines
⏰ **Pomodoro Timer** - Focus sessions with 25-minute work intervals
🔥 **Habit Tracking** - Daily habits with streak counting and weekly progress grid
📊 **Stats & Insights** - Track your productivity with charts and smart observations
🚀 **Workspaces** - Launch multiple apps and URLs with one click
🛠️ **Productivity Tools** - Quick notes, daily quotes, and focus music links
💬 **Talk to Hina** - Voice interaction (coming soon)
🤖 **Robot Integration** - WebSocket server for ESP32 robot companion (optional)

## Tech Stack

### Frontend
- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router v6** - Navigation
- **Lucide React** - Icons

### Backend (Electron)
- **Electron 29** - Desktop app framework
- **better-sqlite3** - Local SQLite database
- **ws** - WebSocket server for robot communication
- **Express** - Local API server (optional)

### Dev Tools
- **electron-builder** - App packaging
- **concurrently** - Run Vite + Electron together
- **cross-env** - Cross-platform environment variables

## Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.x (required for better-sqlite3 native module)
- **Build tools**:
  - **Windows**: Visual Studio Build Tools or `npm install --global windows-build-tools`
  - **Mac**: Xcode Command Line Tools
  - **Linux**: `build-essential` package

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anudeep1914/Hina_Basic_Version.git
   cd Hina_Basic_Version
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   > **Note**: The `postinstall` script will automatically rebuild better-sqlite3 for Electron. If it fails, run manually:
   > ```bash
   > npm run postinstall
   > ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```

   This will:
   - Start Vite dev server on port 5173
   - Launch Electron window
   - Open DevTools automatically
   - Enable hot reload

## Project Structure

```
hina/
├── electron/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Secure IPC bridge
│   └── database.ts      # SQLite database logic
├── src/
│   ├── main.tsx         # React entry point
│   ├── App.tsx          # Router + layout
│   ├── components/      # Reusable components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── HinaFace.tsx
│   │   └── PomodoroTimer.tsx
│   ├── screens/         # Main app screens
│   │   ├── TasksScreen.tsx
│   │   ├── StatsScreen.tsx
│   │   ├── HabitsScreen.tsx
│   │   ├── WorkspacesScreen.tsx
│   │   ├── InsightsScreen.tsx
│   │   ├── TalkScreen.tsx
│   │   ├── ToolsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/           # Zustand state stores
│   └── types/           # TypeScript definitions
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── electron-builder.yml
```

## Database

Hina uses SQLite for local data storage. The database is created automatically on first run at:

- **Windows**: `C:\Users\{username}\AppData\Roaming\hina\hina.db`
- **Mac**: `~/Library/Application Support/hina/hina.db`
- **Linux**: `~/.config/hina/hina.db`

### Database Tables

- `tasks` - Task list with priorities and completion tracking
- `pomodoros` - Focus session history
- `habits` - Daily habits and reminders
- `habit_logs` - Habit completion tracking
- `workspaces` - Workspace configurations
- `app_usage` - App usage tracking (future feature)
- `sessions` - User sessions
- `settings` - App settings

### Seed Data

On first launch, the database is populated with sample data:
- 3 example tasks
- 3 sample habits (Drink water, Take a break, End of day review)
- 2 workspaces (Coding, Research)

## Features Guide

### Tasks

- **Add tasks**: Type in the input field and press Enter or click Add
- **Complete tasks**: Click the circle checkbox
- **Delete tasks**: Hover and click the trash icon
- **Task priorities**: high (red), medium (orange), low (green)
- **Focus mode**: Start a Pomodoro timer linked to a task
- **History**: View completed tasks by date

### Habits & Reminders

- **Create habits**: Click "Add Habit" and fill in details
- **Mark done**: Click "Did it" button
- **Weekly grid**: See 7-day progress for all habits
- **Streaks**: Track consecutive days completed

### Workspaces

- **Create workspace**: Click "New Workspace"
- **Add items**: URLs, apps, or folders
- **Launch**: Opens all workspace items simultaneously
- **Manage**: Edit or delete workspaces

### Settings

- **Personal**: Set your name and Hina's display name
- **Robot IP**: Configure ESP32 robot connection
- **Pomodoro**: Customize work/break durations
- **Data**: Export, clear, or reset app data

## Building for Production

### Build the app
```bash
npm run build
```

This creates platform-specific installers in the `release/` folder:
- **Windows**: `.exe` installer
- **Mac**: `.dmg` image
- **Linux**: `.AppImage`

### Platform-Specific Builds

```bash
# Windows only
npm run build -- --win

# Mac only
npm run build -- --mac

# Linux only
npm run build -- --linux
```

## WebSocket Server

Hina includes a WebSocket server on port 8765 for communication with an ESP32 robot (optional feature).

### Message Format
```json
{
  "cmd": "emotion",
  "value": "happy"
}
```

### Supported Commands
- `task_complete` - Task was completed
- `pomodoro_start` - Pomodoro started
- `pomodoro_end` - Pomodoro ended
- `emotion` - Change robot emotion (happy, focused, thinking, etc.)

## Troubleshooting

### better-sqlite3 installation fails

**Solution**: Make sure you have Python and build tools installed:

```bash
# Windows
npm install --global windows-build-tools

# Mac
xcode-select --install

# Linux
sudo apt-get install build-essential
```

Then rebuild:
```bash
npm run postinstall
```

### Electron window doesn't open

**Solution**: Check that Vite dev server started successfully on port 5173. Look for errors in the terminal.

### Database errors

**Solution**: Delete the database file and restart the app to regenerate it:

- Windows: `%APPDATA%\hina\hina.db`
- Mac: `~/Library/Application Support/hina/hina.db`
- Linux: `~/.config/hina/hina.db`

## Development

### Code Style
- Uses **ESLint** and **Prettier** (configure as needed)
- **Tailwind CSS** for styling - check `tailwind.config.js` for custom colors
- **TypeScript** strict mode enabled

### Hot Reload
Changes to React components reload automatically. Changes to Electron main process require restarting `npm run dev`.

### Debugging
- React DevTools: Available in the Electron window
- Electron DevTools: Opens automatically in dev mode
- Main Process: Use `console.log` (outputs to terminal)

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Built with ♥ by the Hina team

---

**Note**: This is a desktop-only application. All data is stored locally - nothing is sent to external servers.

