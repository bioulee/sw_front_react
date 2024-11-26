// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const SplashScreen = lazy(() => import('./pages/splash_screen/splash_screen.js'));
const MainScreen = lazy(() => import('./pages/main_screen/main_screen.js'));
const CreatePlan = lazy(() => import('./pages/create_plan_screen/create_plan.js'));
const ChoiceTag = lazy(() => import('./pages/choice_tag_screen/choice_tag.js'));
const Loading = lazy(() => import('./pages/loading_screen/loading.js'));
const MyPlan = lazy(() => import('./pages/myplan_screen/myplan.js'));
const Login = lazy(() => import('./pages/login_screen/login.js'));
const SignUp = lazy(() => import('./pages/create_account_screen/create_account.js'));

function NavigationButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navigation buttons on specific routes
  if (location.pathname === '/loading' || location.pathname === '/myplan' || location.pathname === '/' || location.pathname === '/main') {
    return null;
  }

  return (
    <div className="navigation-buttons">
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
      <button className="forward-button" onClick={() => navigate(1)}>
        ➡️
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="App">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/main" element={<MainScreen />} />
              <Route path="/createplan" element={<CreatePlan />} />
              <Route path="/choicetag" element={<ChoiceTag />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/myplan" element={<MyPlan />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </div>
          <NavigationButtons />
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
