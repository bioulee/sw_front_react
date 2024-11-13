import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import GoogleMapReact from 'google-map-react';
import './App.css';
import mainLogo from './img/mainlogo.png'; // 이미지 파일 경로에 맞게 수정
import seoulPic from './img/seoul.jpg'; // 이미지 파일 경로에 맞게 수정
import btn_test from './img/btn_ios.png'; // 이미지 파일 경로에 맞게 수정


//////////////////////////////////////////////////////////////////////////////
function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000); // 3초간 로고 화면 표시
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <img src= {mainLogo} alt="Logo" className="splash-logo" />
    </div>
  );
}



//////////////////////////////////////////////////////////////////////////////
function MainScreen({ onNext, onShowDetails }) {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const today = new Date();

  const dayClassName = (date) => {
    const diffInDays = (date - today) / (1000 * 60 * 60 * 24);
    return diffInDays >= 0 && diffInDays < 10 ? 'highlighted-red' : null;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateChange = (date) => {
    if (startDate && (date - startDate) / (1000 * 60 * 60 * 24) <= 7) {
      setEndDate(date);
    }
  };

  return (
    <div className="main-screen">

      <button className="details-button" onClick={onShowDetails}>
      상세</button>
      
      <input
        className="input-field"
        type="text"
        placeholder="어디로 여행을 가시나요?"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <DatePicker
        className="datepicker-input"
        selected={startDate}
        onChange={handleStartDateChange}
        minDate={today}
        dayClassName={dayClassName}
        placeholderText="출발 날짜를 알려주세요"
      />
      
      <DatePicker
        className="datepicker-input"
        selected={endDate}
        onChange={handleEndDateChange}
        minDate={startDate || today}
        maxDate={startDate ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null}
        dayClassName={dayClassName}
        placeholderText="도착 날짜를 알려주세요"
      />
      <button 
        className="submit-button"
        onClick={() => onNext({ location, startDate, endDate })}>
        일정 생성
      </button>
    </div>
  );
}


//////////////////////////////////////////////////////////////////////////////
function DetailsPanel({ onClose }) {
  return (
    <div className="details-panel">
      <button onClick={onClose}>닫기</button>
      <button>로그인</button>
      <button>내 플랜</button>
      <button>마이페이지</button>
      <button>공지사항</button>
      <button>문의하기</button>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////
function ItineraryInfoScreen({ location, onNext }) {
  return (
    <div className="itinerary-info">
      <img src={seoulPic} alt={location} />
      <p>{location}에 대한 간단한 설명입니다.</p>
      <p>비자: O</p>
      <p>전압: 220V</p>
      <p>시차: +9</p>
      <button onClick={onNext}>일정 제작</button>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////
function ScheduleScreen({ startDate, endDate, onNext }) {
  const [dailySchedules, setDailySchedules] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        days.push({
          date: new Date(currentDate),
          startPeriod: 'AM',
          startHour: 10,
          startMinute: 0,
          endPeriod: 'PM',
          endHour: 8,
          endMinute: 0
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setDailySchedules(days);
    }
  }, [startDate, endDate]);

  const handleTimeChange = (index, field, value) => {
    const updatedSchedules = dailySchedules.map((schedule, i) =>
      i === index ? { ...schedule, [field]: value } : schedule
    );
    setDailySchedules(updatedSchedules);
  };

  return (
    <div className="schedule-screen">
      <h2>여행 시간 설정</h2>
      {dailySchedules.map((schedule, index) => (
        <div key={index} className="day-schedule">
          <p>{schedule.date.toLocaleDateString()}</p>

          <div className="time-picker">
            <label>
              시작 시간:
              <select
                value={schedule.startPeriod}
                onChange={(e) => handleTimeChange(index, 'startPeriod', e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>

              <select
                value={schedule.startHour}
                onChange={(e) => handleTimeChange(index, 'startHour', parseInt(e.target.value))}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select
                value={schedule.startMinute}
                onChange={(e) => handleTimeChange(index, 'startMinute', parseInt(e.target.value))}
              >
                {[0, 15, 30, 45].map((min) => (
                  <option key={min} value={min}>
                    {String(min).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="time-picker">
            <label>
              종료 시간:
              <select
                value={schedule.endPeriod}
                onChange={(e) => handleTimeChange(index, 'endPeriod', e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>

              <select
                value={schedule.endHour}
                onChange={(e) => handleTimeChange(index, 'endHour', parseInt(e.target.value))}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select
                value={schedule.endMinute}
                onChange={(e) => handleTimeChange(index, 'endMinute', parseInt(e.target.value))}
              >
                {[0, 15, 30, 45].map((min) => (
                  <option key={min} value={min}>
                    {String(min).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ))}
      <button onClick={onNext}>선택 완료</button>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////
function PreferenceScreen({ onNext }) {
  const tags = ["문화유산", "쇼핑", "전통시장", "휴양지", "랜드마크", "자연", "공원", "카지노", "스파", "예술", "테마파크"];
  const [selectedTags, setSelectedTags] = useState([]);
  const [transport, setTransport] = useState('대중교통');

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="preference-screen">
      <h2>여행 유형 선택</h2>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={selectedTags.includes(tag) ? 'active' : ''}
        >
          {tag}
        </button>
      ))}
      <h2>이동 방식 선택</h2>
      <button onClick={() => setTransport('자가용')} className={transport === '자가용' ? 'active' : ''}>자가용</button>
      <button onClick={() => setTransport('대중교통')} className={transport === '대중교통' ? 'active' : ''}>대중교통</button>
      <button onClick={onNext}>일정 생성</button>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////
function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onFinish();
        }
        return prev + 1;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="loading-screen">
      <div className="circular-progress">
        <svg className="progress-ring" width="150" height="150">
          <circle className="progress-ring__circle" cx="75" cy="75" r="70" />
        </svg>
        <span className="progress-text">{progress}%</span>
      </div>
      <p>일정 생성 중...</p>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////
//<GoogleMapReact defaultCenter={{ lat: 59.95, lng: 30.33 }} defaultZoom={11} />
function MapScreen() {
  return (
    <div className="map-screen">
      
      <p>여행지 지도</p>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////
function App() {
  const [screen, setScreen] = useState('splash');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [travelData, setTravelData] = useState({});

  const nextScreen = (next, data = {}) => {
    setTravelData((prev) => ({ ...prev, ...data }));
    setScreen(next);
  };

  return (
    <div className="App">
      {screen === 'splash' && <SplashScreen onFinish={() => nextScreen('main')} />}
      {screen === 'main' && (
        <MainScreen
          onNext={(data) => nextScreen('info', data)}
          onShowDetails={() => setDetailsVisible(true)}
        />
      )}
      {detailsVisible && <DetailsPanel onClose={() => setDetailsVisible(false)} />}
      {screen === 'info' && <ItineraryInfoScreen location={travelData.location} onNext={() => nextScreen('schedule')} />}
      {screen === 'schedule' && <ScheduleScreen startDate={travelData.startDate} endDate={travelData.endDate} onNext={() => nextScreen('preference')} />}
      {screen === 'preference' && <PreferenceScreen onNext={() => nextScreen('loading')} />}
      {screen === 'loading' && <LoadingScreen onFinish={() => nextScreen('map')} />}
      {screen === 'map' && <MapScreen />}
    </div>
  );
}

export default App;
