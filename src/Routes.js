
// src/Routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/Index';
import ArrangeBoard from './components/ArrangeBoard/Index';
import GamePage from './components/GamePage/Index';
import WaitingForOpponent from './components/WaitingForOpponent/Index';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/setup" element={<ArrangeBoard />} />
      <Route path="/gamepage" element={<GamePage />} />
      <Route path="/waiting-room" element={<WaitingForOpponent />} />
    </Routes>
  );
};

export default AppRoutes;
