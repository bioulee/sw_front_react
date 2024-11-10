/*
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import mainLogo from './img/mainlogo.png'; // 이미지 파일 경로에 맞게 수정


import React, { useState } from 'react';

function App() {
  
  return (
    <div className="App">

    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
    
    

      <header className="App-header">
        <img src= {mainLogo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

function Bpp() {
  
  return (
    <div className="App">

    <Router>
      <nav>
        <Link to="/">Homdwdwe</Link> | 
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
    
    


    </div>
  );
}


function MainComponent() {
  const [isAppComponent, setIsAppComponent] = useState(true);

  return (
    <div>

      {isAppComponent ? <App /> : <Bpp />}


      <button onClick={() => setIsAppComponent(!isAppComponent)}>
        Switch Component
      </button>
    </div>
  );
}

export default MainComponent;
*/

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';
import './App.css';

const StyledDatePicker = styled(DatePicker)`
  .highlighted-red {
    color: red !important;
    font-weight: bold;
  }
`;

// 스플래시 화면 컴포넌트 (5초 동안 로고 표시)
function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 스플래시 화면 종료 후 세션 스토리지에 'visited' 상태 저장
      sessionStorage.setItem('visited', 'true');
      onFinish();
    }, 5000); // 5초 동안 스플래시 화면 표시

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <img src="background.jpg" alt="Background" className="background-image" />
    </div>
  );
}

// 메인 화면 컴포넌트
function MainScreen({ onNext }) {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const today = new Date();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateChange = (date) => {
    if (startDate) {
      const diffInDays = (date - startDate) / (1000 * 60 * 60 * 24);
      if (diffInDays <= 7) {
        setEndDate(date);
      } else {
        alert("여행 기간은 최대 일주일까지만 설정할 수 있습니다.");
      }
    }
  };

  const dayClassName = (date) => {
    const diffInDays = (date - today) / (1000 * 60 * 60 * 24);
    return diffInDays >= 0 && diffInDays < 10 ? "highlighted-red" : undefined;
  };

  const isDateValid = location && startDate && endDate;

  return (
    <div className="main-screen">
      <h1>Plan Your Trip</h1>

      <div className="input-group">
        <label>Where would you like to travel?</label>
        <input
          type="text"
          placeholder="Enter a location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Select your start date:</label>
        <StyledDatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          minDate={today}
          dayClassName={dayClassName}
          placeholderText="Select start date"
        />
      </div>

      <div className="input-group">
        <label>Select your end date:</label>
        <StyledDatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          minDate={startDate || today}
          maxDate={startDate ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null}
          dayClassName={dayClassName}
          placeholderText="Select end date"
        />
      </div>

      <button onClick={onNext} disabled={!isDateValid}>
        Create Itinerary
      </button>
    </div>
  );
}

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(false);

  useEffect(() => {
    // 세션 스토리지에 'visited'가 없으면 스플래시 화면을 표시
    if (!sessionStorage.getItem('visited')) {
      setIsSplashVisible(true);
    }
  }, []);

  const handleSplashFinish = () => setIsSplashVisible(false);
  const handleNextScreen = () => alert("Your itinerary is being created...");

  return (
    <div className="App">
      {isSplashVisible ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <MainScreen onNext={handleNextScreen} />
      )}
    </div>
  );
}

export default App;
