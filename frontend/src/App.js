import {
  Routes,
  Route,
  Link,
  NavLink,
  BrowserRouter,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import React from "react";
const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });
const Home = () => {
  const { onLogin } = useAuth();
  return (
    <>
      <h2>Home (Public)</h2>

      <button type="button" onClick={onLogin}>
        Sign In
      </button>
    </>
  );
};
const useAuth = () => {
  return React.useContext(AuthContext);
};
const Dashboard = () => {
  const { token } = useAuth();
  return (
    <>
      <h2>Dashboard (Protected)</h2>
      <div>Authenticated as {token}</div>
    </>
  );
};
const AuthContext = React.createContext(null);
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = React.useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);
    const origin = location.state?.from?.pathname || "/dashboard";
    // console.log(
    //   "location.state?.from?.pathname:",
    //   location.state?.from?.pathname
    // );
    navigate(origin);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return children;
};
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <h1>React Router</h1>

        <Navigation />
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>hi</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
const Navigation = () => {
  const { onLogout, token } = useAuth();
  // console.log(token);
  return (
    <nav>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/admin">Admin</NavLink>
      {token && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};
const Admin = () => {
  return (
    <>
      <h2>Admin (Protected)</h2>
    </>
  );
};

export default App;
