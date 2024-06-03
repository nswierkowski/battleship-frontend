
// src/Routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/Index';
import ArrangeBoard from './components/ArrangeBoard/Index';
import Board from './components/Board/Index';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/setup" element={<ArrangeBoard />} />
    </Routes>
  );
};

export default AppRoutes;
