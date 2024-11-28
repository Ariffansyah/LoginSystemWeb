import './App.css';
import './components/Main.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import Error404 from './components/Error404';
import { jwtDecode } from 'jwt-decode';

function App() {

  const hideNavPaths = ["/signup", "/login", "/forget-password", "/reset-password",];
  const hideNavForResetPassword = /^\/reset-password\/[^/]+$/.test(location.pathname);

  const tokenauth = localStorage.getItem("tokenauth");
  let isAuthenticated = false;

  if (tokenauth) {
    try {
      // Decode token to check expiration
      const decodedToken = jwtDecode(tokenauth);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp > currentTime) {
        // Token is valid
        isAuthenticated = true;
      } else {
        // Token is expired; clear token
        localStorage.removeItem("tokenauth");
        isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem("tokenauth");
      isAuthenticated = false;
    }
  }

  if (isAuthenticated) {
    return (
      <>
        {!hideNavPaths.includes(location.pathname) && !hideNavForResetPassword && <Navbar />}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/*" element={<Error404 />} />
          </Routes>
        </Router >
      </>
    )
  } else {
    return (
      <>
        {!hideNavPaths.includes(location.pathname) && !hideNavForResetPassword && <Navbar />}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/*" element={<Error404 />} />
          </Routes>
        </Router >
      </>
    )
  }
}
export default App


