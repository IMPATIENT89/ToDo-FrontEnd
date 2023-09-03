import logo from './logo.svg';
import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import TaskListing from './TaskListing'
import TaskCreation from './TaskCreation'
import TaskDetail from './TaskDetail'
import Navbar from './Navbar'
import TaskUpdate from './TaskUpdate'

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TaskListing />} />
          <Route path="/task/:taskId" element={<TaskDetail />} />
          <Route path="/task/new" element={<TaskCreation />} />
          <Route path="/task/:taskId/edit" element={<TaskUpdate />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
