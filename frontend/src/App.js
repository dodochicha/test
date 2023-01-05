import {
  Routes,
  Route,
  Link,
  Navigate,
  BrowserRouter,
  Outlet,
} from "react-router-dom";
import React from "react";
const App = () => {
  const [user, setUser] = React.useState(null);

  const handleLogin = () =>
    setUser({
      id: "1",
      name: "robin",
      permissions: ["analyze"],
      roles: ["admin"],
    });
  const handleLogout = () => setUser(null);

  return (
    <BrowserRouter>
      <h1>React Router</h1>

      <Navigation />

      {user ? (
        <button onClick={handleLogout}>Sign Out</button>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}

      <Routes>
        <Route index element={<Landing />} />
        <Route path="landing" element={<Landing />} />
        <Route element={<ProtectedRoute isAllowed={!!user} />}>
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route
          path="analytics"
          element={
            <ProtectedRoute
              redirectPath="/home"
              isAllowed={!!user && user.permissions.includes("analyze")}
            >
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute
              redirectPath="/home"
              isAllowed={!!user && user.roles.includes("admin")}
            >
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </BrowserRouter>
  );
};

const Navigation = () => (
  <nav>
    <Link to="/landing">Landing</Link>
    <Link to="/home">Home</Link>
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/analytics">Analytics</Link>
    <Link to="/admin">Admin</Link>
  </nav>
);

const Landing = () => {
  return <h2>Landing (Public: anyone can access this page)</h2>;
};
const Home = () => {
  return <h2>Home (Protected: authenticated user required)</h2>;
};

const Dashboard = () => {
  return <h2>Dashboard (Protected: authenticated user required)</h2>;
};

const Analytics = () => {
  return (
    <h2>
      Analytics (Protected: authenticated user with permission 'analyze'
      required)
    </h2>
  );
};

const Admin = () => {
  return (
    <h2>Admin (Protected: authenticated user with role 'admin' required)</h2>
  );
};

const ProtectedRoute = ({ isAllowed, redirectPath = "/landing", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default App;
