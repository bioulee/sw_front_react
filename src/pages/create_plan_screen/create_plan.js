import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './create_plan.css';

const koreanToRomanized = (korean) => {
  const romanizationMap = {
    서울: 'seoul',
    세종: 'sejong',
    부산: 'busan',
    제주: 'jeju',
    강릉: 'gangneung',
  };
  return romanizationMap[korean] || korean;
};

function CreatePlan() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const today = new Date();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedHotelTags, setSelectedHotelTags] = useState([]);
  const [transportation, setTransportation] = useState('대중교통');
  const [accommodationAddress, setAccommodationAddress] = useState('');
  const [hotelBooked, setHotelBooked] = useState(null); // 숙소 예약 여부 상태 추가

  const [suggestions, setSuggestions] = useState([]);
  const destinations = ['서울', '부산', '제주', '강릉', '대구', '인천', '속초', '전주', '성남'];
  const tagOptions = ['문화유산', '쇼핑', '전통시장', '휴양지', '랜드마크', '자연', '공원', '카지노', '스파', '예술', '테마파크'];
  const hotelTagOptions = ['1성', '2성', '3성', '4성', '5성'];

  const [days, setDays] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setLocation(input);

    if (input) {
      const isHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(input);
      const inputRomanized = input.toLowerCase();

      const filteredSuggestions = destinations.filter((destination) => {
        const romanizedDestination = koreanToRomanized(destination).toLowerCase();
        const destinationRomanized = romanizedDestination || destination.toLowerCase();

        if (isHangul) {
          return destination.includes(input);
        } else {
          return (
            romanizedDestination.includes(inputRomanized) ||
            destination.toLowerCase().includes(inputRomanized)
          );
        }
      });

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const dayClassName = (date) => {
    const diffInDays = (date - today) / (1000 * 60 * 60 * 24);
    return diffInDays >= -1 && diffInDays < 9 ? 'highlighted-red' : null;
  };

  const calculateDays = () => {
    if (!startDate || !endDate) {
      return [];
    }

    const days = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  useEffect(() => {
    if (startDate && endDate) {
      const calculatedDays = calculateDays();
      setDays(calculatedDays);
      setTimeRanges(calculatedDays.map(() => ({ start: '10:00', end: '20:00' })));
      setErrorMessages(calculatedDays.map(() => null));
    }
  }, [startDate, endDate]);

  const handleTimeChange = (index, field, value) => {
    const updatedTimeRanges = [...timeRanges];
    updatedTimeRanges[index][field] = value;

    const start = updatedTimeRanges[index].start;
    const end = updatedTimeRanges[index].end;
    let errorMessage = null;

    if (field === 'start' && value >= end) {
      errorMessage = '시작 시간은 종료 시간보다 빠를 수 없습니다.';
    }
    if (field === 'end' && value <= start) {
      errorMessage = '종료 시간은 시작 시간보다 늦어야 합니다.';
    }

    const updatedErrors = [...errorMessages];
    updatedErrors[index] = errorMessage;
    setErrorMessages(updatedErrors);
    setTimeRanges(updatedTimeRanges);
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag)
        : [...prevSelected, tag]
    );
  };
  const handleHotelTagClick = (tag) => {
    setSelectedHotelTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag)
        : [...prevSelected, tag]
    );
  };

  const handleTransportationClick = (type) => {
    setTransportation(type);
  };

  const handleHotelBookedClick = (booked) => {
    setHotelBooked(booked);
    if (!booked) {
      setAccommodationAddress('');
      setSelectedHotelTags([]);
    }
<<<<<<< HEAD
    navigate('/choicetag', { state: { location, startDate, endDate, timeRanges } });
=======
  };

  const handleNext = () => {
    navigate('/loading', { state: { location, startDate, endDate, timeRanges, selectedTags, selectedHotelTags, transportation, accommodationAddress } });
>>>>>>> 56612e690813e425f2568e3922e44b780d5a444c
  };

  return (
    <div className="create-plan_on">
      <div className="main_menu0_create">
        <div className="upper-box_create">
          <button className="logo-button_create" onClick={() => navigate('/main')} />
        </div>
      </div>

      <div className="where_create">
        <h3 className="where_ask_create">어디로 여행가시나요?</h3>
        <div className="input-container_create">
          <input
            className="input-field_create"
            type="text"
            placeholder="어디로 여행을 가시나요?"
            value={location}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list_create">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item_create"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="when_create">
        <h3 className="when_ask_create">일정이 어디까지 되시나요?</h3>

        <DatePicker
          className="datepicker-input"
          selected={startDate}
          onChange={handleStartDateChange}
          minDate={today}
          dateFormat="yyyy/MM/dd"
          placeholderText="출발 날짜를 선택해주세요"
          dayClassName={dayClassName}
          calendarClassName="custom-calendar"
        />

        <DatePicker
          className="datepicker-input"
          selected={endDate}
          onChange={handleEndDateChange}
          minDate={startDate || today}
          maxDate={startDate ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null}
          dateFormat="yyyy/MM/dd"
          placeholderText="도착 날짜를 선택해주세요 (최대일정 7일)"
          dayClassName={dayClassName}
          calendarClassName="custom-calendar"
        />
      </div>

      <div className="time_create">
        <h3 className="time_ask_create">시간이 어디까지 되시나요?</h3>

        <ul>
          {days.map((day, index) => (
            <li key={index}>
              <div>
                <strong>{day.toLocaleDateString()}</strong>
                <div>
                  <label>
                    시작 시간:
                    <input
                      type="time"
                      value={timeRanges[index]?.start || '10:00'}
                      onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                    />
                  </label>
                  <label>
                    종료 시간:
                    <input
                      type="time"
                      value={timeRanges[index]?.end || '20:00'}
                      onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                    />
                  </label>
                </div>
                {errorMessages[index] && (
                  <p className="error-message_create">{errorMessages[index]}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className='tag_create'>
        <h3 className='tag_ask_create'>태그를 선택해주세요</h3>
        <div className="place_tags_create">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <h3>원하시는 이동방식을 선택해주세요</h3>
      <div className="transportation-container_create">
        <button
          className={`transportation-button_create ${transportation === '대중교통' ? 'selected' : ''}`}
          onClick={() => handleTransportationClick('대중교통')}
        >
          대중교통
        </button>
        <button
          className={`transportation-button_create ${transportation === '자가용' ? 'selected' : ''}`}
          onClick={() => handleTransportationClick('자가용')}
        >
          자가용
        </button>
      </div>

      <h3>호텔을 예약하셨나요?</h3>
      <div className="hotel-booked-container">
        <button
          className={`hotel-booked-button ${hotelBooked === true ? 'selected' : ''}`}
          onClick={() => handleHotelBookedClick(true)}
        >
          예
        </button>
        <button
          className={`hotel-booked-button ${hotelBooked === false ? 'selected' : ''}`}
          onClick={() => handleHotelBookedClick(false)}
        >
          아니오
        </button>
      </div>

      {hotelBooked === true && (
        <div className="accommodation-container">
          <h3>예약한 숙소의 주소를 입력하세요</h3>
          <input
            type="text"
            className="accommodation-input"
            placeholder="숙소 주소를 입력하세요"
            value={accommodationAddress}
            onChange={(e) => setAccommodationAddress(e.target.value)}
          />
        </div>
      )}

      {hotelBooked === false && (
        <div className="hotel_tags_create">
          <h3>원하는 숙소 등급을 선택해주세요</h3>
          {hotelTagOptions.map((tag) => (
            <button
              key={tag}
              className={`tag-button ${selectedHotelTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => handleHotelTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <button className="input-field_create" onClick={handleNext}>일정 생성</button>
    </div>
  );
}

export default CreatePlan;
