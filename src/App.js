// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

const SplashScreen = lazy(() => import('./pages/splash_screen/splash_screen.js'));
const MainScreen = lazy(() => import('./pages/main_screen/main_screen.js'));
const CreatePlan = lazy(() => import('./pages/create_plan_screen/create_plan.js'));
const ChoiceTag = lazy(() => import('./pages/choice_tag_screen/choice_tag.js'));
const Loading = lazy(() => import('./pages/loading_screen/loading.js'));
const MyPlan = lazy(() => import('./pages/myplan_screen/myplan.js'));
const Login = lazy(() => import('./pages/login_screen/login.js'));
const SignUp = lazy(() => import('./pages/create_account_screen/create_account.js'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="App">
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
      </Suspense>
    </Router>
  );
}

export default App;

