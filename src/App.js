/**
 * Web Pulse Frontend Application
 * Handles client-side routing, protected routes, and global notifications.
 */

import './App.css';
import Main from './pages/mainpage/Main'; 
import Login from './pages/loginpage/Login';
import Register from './pages/registerpage/Register';
import Monitor from './component/Add_website/AddWebsite';
import EditWebsite from './component/Edit/edit';


import Details from './component/AccountDetails/Details';

import Listing from './component/Listing/Listing';
import WebDetails from './component/WebDetails/WebDetails';
import Dashboard from './component/Dashboard/Dashboard';
import { Routes, Route } from 'react-router-dom';
import ContactUs from './component/Contact/Contact';
import ProtectedRoute from './component/ProtectedRoute';


import { NotificationProvider } from './component/Notification/Notification';

function App() {

  return (
    <NotificationProvider>
      <Routes>

      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />      
      <Route path="/home" element={<Main />} />
      
      {/* Protected Routes */}
      <Route path="/monitor" element={<ProtectedRoute><Monitor /></ProtectedRoute>} />
      <Route path="/monitor/edit/:id" element={<ProtectedRoute><EditWebsite /></ProtectedRoute>} />
      <Route path="/detail" element={<ProtectedRoute><Details /></ProtectedRoute>} />

      <Route path="/listing" element={<ProtectedRoute><Listing /></ProtectedRoute>} />
      <Route path='/webDetail' element={<ProtectedRoute><WebDetails /></ProtectedRoute>} />
      <Route path='/Dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/Contact' element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
      </Routes>
    </NotificationProvider>
  );
}


export default App;
