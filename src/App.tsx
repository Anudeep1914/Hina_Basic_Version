import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import TasksScreen from './screens/TasksScreen'
import StatsScreen from './screens/StatsScreen'
import HabitsScreen from './screens/HabitsScreen'
import WorkspacesScreen from './screens/WorkspacesScreen'
import InsightsScreen from './screens/InsightsScreen'
import TalkScreen from './screens/TalkScreen'
import ToolsScreen from './screens/ToolsScreen'
import SettingsScreen from './screens/SettingsScreen'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-bg-primary text-text-primary">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<TasksScreen />} />
              <Route path="/stats" element={<StatsScreen />} />
              <Route path="/habits" element={<HabitsScreen />} />
              <Route path="/workspaces" element={<WorkspacesScreen />} />
              <Route path="/insights" element={<InsightsScreen />} />
              <Route path="/talk" element={<TalkScreen />} />
              <Route path="/tools" element={<ToolsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
