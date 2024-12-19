// src/App.js
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';


const SplashScreen = lazy(() => import('./pages/splash_screen/splash_screen.js'));
const MainScreen = lazy(() => import('./pages/main_screen/main_screen.js'));
const CreatePlan = lazy(() => import('./pages/create_plan_screen/create_plan.js'));
const Loading = lazy(() => import('./pages/loading_screen/loading.js'));
const MyPlan = lazy(() => import('./pages/myplan_screen/myplan.js'));
const Login = lazy(() => import('./pages/login_screen/login.js'));
const SignUp = lazy(() => import('./pages/create_account_screen/create_account.js'));
const Record = lazy(() => import('./pages/record_screen/record.js'));
const MyRecord = lazy(() => import('./pages/myrecords_screen/myrecord.js'));

function NavigationButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  // 특정 경로에서는 뒤로가기 버튼을 숨김
  if (location.pathname === '/createplan' || location.pathname === '/loading' || location.pathname === '/myplan' || location.pathname === '/' || location.pathname === '/main'|| location.pathname === '/record') {
    return null;
  }

  return (
    <div className="navigation-buttons">
      <button className="back-button" onClick={() => navigate(-1)}>
         뒤로가기
      </button>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [userEmail, setUserEmail] = useState(null);  // 로그인한 이메일 상태 관리
  useEffect(() => {
    // localStorage에 저장된 로그인 상태 확인
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedEmail && storedLoginStatus) {
      setUserEmail(storedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (email) => {
    // 로그인 처리 후 로그인 상태 업데이트 및 localStorage에 상태 저장
    setIsLoggedIn(true);
    setUserEmail(email);  // 로그인 시 이메일 저장
    console.log("로그인된 이메일:", email);  // 확인용 로그
    // 이메일을 로컬 저장소에 저장
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    // 로그아웃 처리 후 상태 업데이트 및 localStorage에서 상태 제거
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="App">
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route
                    path="/main"
                    element={<MainScreen isLoggedIn={isLoggedIn}  onLogout={handleLogout} userEmail={userEmail} />} // 로그인 상태와 로그아웃 함수를 MainScreen에 전달
                  />
                  <Route
                    path="/createplan"
                    element={isLoggedIn ? <CreatePlan /> : <Login onLogin={handleLogin} />} // 로그인이 필요할 때 로그인 화면으로 리다이렉트
                  />
                  <Route path="/loading" element={<Loading />} />
                  <Route path="/myplan" element={isLoggedIn ? <MyPlan userEmail={userEmail} /> : <Login onLogin={handleLogin} />} />
                  <Route path="/login" element={<Login onLogin={handleLogin} />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/record" element={<Record />} />
                  <Route
                      path="/myrecord"
                      element={isLoggedIn ? <MyRecord userEmail={userEmail} /> : <Login onLogin={handleLogin} />}
                  />
                </Routes>
              </div>
              <NavigationButtons />
            </div>
          </Suspense>
        </Router>
  );
}

export default App;