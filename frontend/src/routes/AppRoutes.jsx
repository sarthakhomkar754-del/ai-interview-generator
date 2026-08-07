import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import GenerateQuestions from '../pages/GenerateQuestions';
import QuestionDetails from '../pages/QuestionDetails';
import Favorites from '../pages/Favorites';
import History from '../pages/History';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';

// Practice Hub & Category Pages
import PracticeHub from '../pages/PracticeHub';
import AptitudePractice from '../pages/AptitudePractice';
import CodingPractice from '../pages/CodingPractice';
import HRPractice from '../pages/HRPractice';
import SQLPractice from '../pages/SQLPractice';
import TechnicalPractice from '../pages/TechnicalPractice';

import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/generate"  element={<ProtectedRoute><GenerateQuestions /></ProtectedRoute>} />
      <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetails /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Practice Hub (Public) & Category Pages (Protected) */}
      <Route path="/practice"           element={<PracticeHub />} />
      <Route path="/practice/aptitude"  element={<ProtectedRoute><AptitudePractice /></ProtectedRoute>} />
      <Route path="/practice/coding"    element={<ProtectedRoute><CodingPractice /></ProtectedRoute>} />
      <Route path="/practice/hr"        element={<ProtectedRoute><HRPractice /></ProtectedRoute>} />
      <Route path="/practice/sql"       element={<ProtectedRoute><SQLPractice /></ProtectedRoute>} />
      <Route path="/practice/technical" element={<ProtectedRoute><TechnicalPractice /></ProtectedRoute>} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
