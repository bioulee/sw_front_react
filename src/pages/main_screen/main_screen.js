import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "/Users/biou/Documents/sw_proj_react/src/pages/main_screen/main_screen.css";

// 한글을 영문으로 변환하는 함수
const koreanToRomanized = (korean) => {
  const romanizationMap = {
    서울: 'seoul',
    세종: 'sejong',
    부산: 'busan',
    제주: 'jeju',
    강릉: 'gangneung',
    대구: 'daegu',
    인천: 'incheon',
    속초: 'sokcho',
    전주: 'jeonju',
    성남: 'seongnam'
  };

  return romanizationMap[korean] || korean;
};

function MainScreen() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const today = new Date();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);  // 출발일 변경 시 도착일 초기화
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const [suggestions, setSuggestions] = useState([]); // 자동완성 목록
  const destinations = ['서울', '부산', '제주', '강릉', '대구', '인천', '속초', '전주', '성남']; // 여행지 목록

  const handleInputChange = (e) => {
    const input = e.target.value; // e.target.value에서 입력값을 가져옴
    setLocation(input); // 상태를 입력값으로 업데이트

    if (input) {
      const isHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(input);  // 입력값이 한글인지 확인
      const inputRomanized = input.toLowerCase();  // 영문 입력을 소문자로 변환

      // 자동완성 목록 필터링
      const filteredSuggestions = destinations.filter((destination) => {
        const romanizedDestination = koreanToRomanized(destination).toLowerCase();  // 한글을 영문으로 변환
        const destinationRomanized = romanizedDestination || destination.toLowerCase();

        // 입력값이 목적지의 부분 문자열에 포함되는지 확인
        if (isHangul) {
          return destination.includes(input);  // 한글 입력에 대해 부분 문자열로 매칭
        } else {
          return romanizedDestination.includes(inputRomanized) || destination.toLowerCase().includes(inputRomanized);  // 영문 입력에 대해 부분 문자열로 매칭
        }
      });

      setSuggestions(filteredSuggestions); // 자동완성 목록 업데이트
    } else {
      setSuggestions([]); // 입력값이 없으면 자동완성 목록 초기화
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion); // 클릭한 여행지로 입력 필드 값 변경
    setSuggestions([]); // 자동완성 목록 숨기기
  };

  // 캘린더의 10일 내 빨간색으로 만들어주는 기능
  const dayClassName = (date) => {
    const diffInDays = (date - today) / (1000 * 60 * 60 * 24);
    return diffInDays >= -1 && diffInDays < 9 ? 'highlighted-red' : null;
  };

  // "일정 생성" 버튼 비활성화 조건
  const isFormValid = location && startDate && endDate;

  return (
    <div className="main-screen">
      <div className="upper-box">
        <button className="logo-button" onClick={() => navigate('/main')} />
        <button className="details-button" onClick={() => navigate('/details')} />
      </div>

      <div className="choice_box">
        <h3 className='header'>여행계획이 고민이신가요?</h3>
        <div className="input-container">
          <input
            className="input-field"
            type="text"
            placeholder="어디로 여행을 가시나요?"
            value={location}
            onChange={handleInputChange}
          />
          {/* 자동완성 목록 */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)} // 항목 클릭 시 해당 여행지로 설정
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 출발일 선택 달력 */}
        <DatePicker
          className="datepicker-input"
          selected={startDate}
          onChange={handleStartDateChange}
          minDate={today}
          dateFormat="yyyy/MM/dd"
          placeholderText="출발 날짜를 선택해주세요ㅇ"
          dayClassName={dayClassName}
          calendarClassName="custom-calendar"
        />

        {/* 도착일 선택 달력 */}
        <DatePicker
          className="datepicker-input"
          selected={endDate}
          onChange={handleEndDateChange}
          minDate={startDate || today}
          maxDate={startDate ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null}  // 출발일 기준 7일 이내로 제한
          dateFormat="yyyy/MM/dd"
          placeholderText="도착 날짜를 선택해주세요 (최대 7일)"
          dayClassName={dayClassName}
          calendarClassName="custom-calendar"
        />

        {/* 일정 생성 버튼 */}
        <button
          className="submit-button"
          onClick={() => navigate('/createplan')}
          disabled={!isFormValid}  // 여행지와 날짜가 모두 입력되면 활성화
        >
          일정 생성
        </button>
      </div>

      <div>
        <button className='record-button' onClick={() => navigate('/record')}>
          내플렌
        </button>
      </div>
    </div>
  );
}

export default MainScreen;
