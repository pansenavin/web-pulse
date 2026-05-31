import React, { createContext, useState, useContext, useCallback } from 'react';
import './Notification.css';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  const closeNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className={`notification-overlay`}>
          <div className={`notification-card ${notification.type}`}>
            <div className="notification-content">
              <div className="notification-icon">
                {notification.type === 'success' && '✓'}
                {notification.type === 'error' && '✕'}
                {notification.type === 'info' && 'ℹ'}
              </div>
              <p>{notification.message}</p>
            </div>
            <button className="notification-close" onClick={closeNotification}>&times;</button>
            <div className="notification-progress"></div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
