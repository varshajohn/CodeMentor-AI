import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Session from "./pages/Session";

// Authentication state guard wrapper
function RouteGuard({ children }) {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <RouteGuard>
            <Dashboard />
          </RouteGuard>
        }
      />
      <Route
        path="/history"
        element={
          <RouteGuard>
            <History />
          </RouteGuard>
        }
      />
      <Route
        path="/session/:id"
        element={
          <RouteGuard>
            <Session />
          </RouteGuard>
        }
      />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;