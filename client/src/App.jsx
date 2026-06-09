import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Link2, LogIn, LogOut, UserRound } from 'lucide-react';
import { api, getToken, setToken } from './lib/api.js';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Analytics from './pages/Analytics.jsx';
import Auth from './pages/Auth.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [guestMode, setGuestMode] = useState(() => localStorage.getItem('guestMode') === 'true');
  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setCheckingUser(false);
        return;
      }

      try {
        const { data } = await api.get('/api/auth/me');
        setUser(data.user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setCheckingUser(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (checkingUser) return;
    if (!user && !guestMode && location.pathname !== '/auth') {
      navigate('/auth', { replace: true });
    }
    if (user && location.pathname === '/auth') {
      navigate('/dashboard', { replace: true });
    }
  }, [checkingUser, guestMode, location.pathname, navigate, user]);

  function handleAuth({ token, user: nextUser }) {
    setToken(token);
    localStorage.removeItem('guestMode');
    setGuestMode(false);
    setUser(nextUser);
    navigate('/dashboard');
  }

  function continueAsGuest() {
    localStorage.setItem('guestMode', 'true');
    setGuestMode(true);
    navigate('/');
  }

  function requireAuthPrompt() {
    localStorage.removeItem('guestMode');
    setGuestMode(false);
    navigate('/auth');
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('guestMode');
    localStorage.removeItem('guestLinkCount');
    setUser(null);
    setGuestMode(false);
    navigate('/auth');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>Shortlytics</strong>
            <span>Fast links, clean signal</span>
          </div>
        </div>
        <nav>
          <NavLink to="/" end>
            <Link2 size={18} />
            Shorten
          </NavLink>
          <NavLink to="/dashboard">
            <BarChart3 size={18} />
            Dashboard
          </NavLink>
          {!user && (
            <NavLink to="/auth">
              <LogIn size={18} />
              Login / Sign up
            </NavLink>
          )}
        </nav>
        <div className="account-box">
          {user ? (
            <>
              <div className="account-user">
                <UserRound size={18} />
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
              <button className="sidebar-button" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="account-user muted-sidebar">
              <UserRound size={18} />
              <div>
                <strong>{checkingUser ? 'Checking session' : guestMode ? 'Guest mode' : 'Signed out'}</strong>
                <span>{checkingUser ? 'Please wait' : guestMode ? '5 free links included' : 'Login to save links'}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<Home user={user} onRequireAuth={requireAuthPrompt} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics/:slug" element={<Analytics />} />
          <Route path="/auth" element={<Auth onAuth={handleAuth} onGuest={continueAsGuest} />} />
        </Routes>
      </main>
    </div>
  );
}
