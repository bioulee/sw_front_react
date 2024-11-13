// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SplashScreen from './pages/splash_screen.js';
import MainScreen from './pages/main_screen.js';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/main" element={<MainScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
