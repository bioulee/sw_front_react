// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SplashScreen from './pages/splash_screen/splash_screen.js';
import MainScreen from './pages/main_screen/main_screen.js';
import CreatePlan from './pages/create_plan_screen/create_plan.js'
import ChoiceTag from'./pages/choice_tag_screen/choice_tag.js'
import Loading from './pages/loading_screen/loading.js';
import MyPlan from './pages/myplan_screen/myplan.js';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/main" element={<MainScreen />} />
          <Route path="/createplan" element={<CreatePlan />} />
          <Route path="/choicetag" element={<ChoiceTag />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/myplan" element={<MyPlan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

