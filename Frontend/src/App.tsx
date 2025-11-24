import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/Login page/login";
import SignupPage from "./pages/RegisterPage/RegisterPage";
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/dashbaord/dashboard";
import SidebarLayout from "./pages/Layouts/sideBarLayout";
import { ThemeProvider } from "./contexts/themeContext";
import { Toaster } from "sonner";
import EmployeesList from "./pages/Employees/EmployeesList";
import TeamsList from "./pages/Teams/TeamsList";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="bg-background min-h-screen">
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<SignupPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <SidebarLayout>
                      <Dashboard />
                    </SidebarLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employees"
                element={
                  <ProtectedRoute>
                    <SidebarLayout>
                      <EmployeesList />
                    </SidebarLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <SidebarLayout>
                      <TeamsList />
                    </SidebarLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
