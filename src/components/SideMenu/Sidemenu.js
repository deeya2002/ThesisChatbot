import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidemenu.css';

const SideMenu = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };


  // Fetch history from local storage or an API
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history") || '[]');
    setHistory(storedHistory);
  }, []);

  return (
    <aside className='sidemenu'>
      <div className='sidemenu-button'>
        <span>+</span>
        New Chat Questions
      </div>
      <div className='sidemenu-buttons'>
        <button className="btn btn-outline mb-2">Quiz App</button>
      </div>
      <div className='auth-buttons'>
        <Link className="btn btn-outline-danger" to="/login">
          Login
        </Link>
        <Link className="btn btn-outline-success ms-2" to="/register">
          Register
        </Link>
      </div>
      <div className='history-section'>
        <h5>History</h5>
        <ul>
          {history.length > 0 ? (
            history.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <li>No history available</li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default SideMenu;
