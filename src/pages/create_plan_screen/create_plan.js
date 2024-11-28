import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // 날짜 선택기 라이브러리를 가져옴
import 'react-datepicker/dist/react-datepicker.css'; // 날짜 선택기의 스타일을 가져옴
import './create_plan.css'; // 해당 컴포넌트에 대한 스타일 시트를 가져옴

// 한글 지명을 영문으로 변환하는 함수
const koreanToRomanized = (korean) => {
  // 한글 지명과 대응하는 영문 지명을 매핑한 객체
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
    성남: 'seongnam',
  };

  return romanizationMap[korean] || korean; // 매핑에 없는 경우 원본 문자열을 반환
};

// CreatePlan 컴포넌트 정의
function CreatePlan() {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 후크를 사용
  const [location, setLocation] = useState(''); // 여행지 입력 값을 상태로 관리
  const [startDate, setStartDate] = useState(null); // 출발 날짜를 상태로 관리
  const [endDate, setEndDate] = useState(null); // 도착 날짜를 상태로 관리
  const today = new Date(); // 현재 날짜를 가져옴
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedHotelTags, setSelectedHotelTags] = useState([]);
  const [transportation, setTransportation] = useState('대중교통'); // 기본값: 대중교통
  const [accommodationAddress, setAccommodationAddress] = useState('');

  const [suggestions, setSuggestions] = useState([]); // 자동완성 목록을 상태로 관리
  const destinations = ['서울', '부산', '제주', '강릉', '대구', '인천', '속초', '전주', '성남'];
  const tagOptions = ['문화유산', '쇼핑', '전통시장', '휴양지', '래딩마크', '자연', '공원', '카지노', '스파', '예술', '테마파크'];
  const hotelTagOptions = ['1성', '2성', '3성', '4성', '5성'];

  const [days, setDays] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  // 사용자가 자동완성 목록의 항목을 클릭했을 때 실행되는 함수
  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion); // 선택된 항목으로 여행지 상태 업데이트
    setSuggestions([]); // 자동완성 목록을 숨기기
  };

  // 여행지 입력 필드가 변경될 때 실행되는 함수
  const handleInputChange = (e) => {
    const input = e.target.value; // 입력된 값을 가져옴
    setLocation(input); // 입력된 값을 여행지 상태에 업데이트

    if (input) { // 입력값이 있는 경우에만 자동완성 목록을 필터링
      const isHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(input); // 입력값이 한글인지 여부 확인
      const inputRomanized = input.toLowerCase(); // 입력값을 소문자로 변환

      // 자동완성 목록 필터링
      const filteredSuggestions = destinations.filter((destination) => {
        const romanizedDestination = koreanToRomanized(destination).toLowerCase(); // 한글을 영문으로 변환하고 소문자로 변환
        const destinationRomanized = romanizedDestination || destination.toLowerCase(); // 영문이 없으면 원래 문자열 소문자로 변환

        // 입력값과 여행지 이름을 비교하여 필터링
        if (isHangul) {
          return destination.includes(input); // 입력값이 한글일 경우 해당 여행지를 포함하는지 확인
        } else {
          return (
            romanizedDestination.includes(inputRomanized) ||
            destination.toLowerCase().includes(inputRomanized)
          ); // 입력값이 영문일 경우 변환된 영문과 원래 여행지 이름에 대해 포함 여부 확인
        }
      });

      setSuggestions(filteredSuggestions); // 필터링된 자동완성 목록으로 상태 업데이트
    } else {
      setSuggestions([]); // 입력값이 없으면 자동완성 목록 초기화
    }
  };

  // 출발 날짜 변경 시 호출되는 함수
  const handleStartDateChange = (date) => {
    setStartDate(date); // 선택된 출발 날짜로 상태 업데이트
    setEndDate(null); // 출발 날짜가 변경되면 도착 날짜 초기화
  };

  // 도착 날짜 변경 시 호출되는 함수
  const handleEndDateChange = (date) => {
    setEndDate(date); // 선택된 도착 날짜로 상태 업데이트
  };

  // 특정 날짜에 CSS 클래스를 추가하는 함수
  const dayClassName = (date) => {
    const diffInDays = (date - today) / (1000 * 60 * 60 * 24); // 오늘부터의 날짜 차이 계산
    return diffInDays >= -1 && diffInDays < 9 ? 'highlighted-red' : null; // 오늘부터 9일 이내의 날짜는 특수 클래스를 추가
  };

  // 여행 기간을 동적으로 계산하는 함수
  const calculateDays = () => {
    if (!startDate || !endDate) { // 출발일과 도착일이 설정되지 않았으면 빈 번역 반환
      return [];
    }

    const days = []; // 여행 기간을 담을 번역 초기화
    let currentDate = new Date(startDate); // 출발 날짜로 초기화

    while (currentDate <= endDate) { // 출발 날짜부터 도착 날짜까지 반복
      days.push(new Date(currentDate)); // 현재 날짜를 days 번역에 추가
      currentDate.setDate(currentDate.getDate() + 1); // 현재 날짜를 하루씩 증가시키기
    }

    return days; // 여행 기간 번역 반환
  };

  useEffect(() => {
    if (startDate && endDate) {
      const calculatedDays = calculateDays();
      setDays(calculatedDays);
      setTimeRanges(calculatedDays.map(() => ({ start: '10:00', end: '20:00' })));
      setErrorMessages(calculatedDays.map(() => null));
    }
  }, [startDate, endDate]);

  // 각 날자의 시간 변경 시 호출되는 함수
  const handleTimeChange = (index, field, value) => {
    const updatedTimeRanges = [...timeRanges]; // 기존 시간 범위를 복사
    updatedTimeRanges[index][field] = value; // 해당 날자의 시작 또는 종료 시간 업데이트

    const start = updatedTimeRanges[index].start; // 시작 시간 가져옴
    const end = updatedTimeRanges[index].end; // 종료 시간 가져옴
    let errorMessage = null; // 에러 메시지 초기화

    if (field === 'start' && value >= end) { // 시작 시간이 종료 시간 이하일 경우 에러 설정
      errorMessage = '시작 시간은 종료 시간보다 빠를 수 없습니다.';
    }
    if (field === 'end' && value <= start) { // 종료 시간이 시작 시간 이전일 경우 에러 설정
      errorMessage = '종료 시간은 시작 시간보다 늦어야 합니다.';
    }

    const updatedErrors = [...errorMessages]; // 기존 에러 메시지를 복사
    updatedErrors[index] = errorMessage; // 해당 날자의 에러 메시지 업데이트
    setErrorMessages(updatedErrors); // 상태 업데이트
    setTimeRanges(updatedTimeRanges); // 시간 범위 상태 업데이트
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag) // 선택 해제
        : [...prevSelected, tag] // 선택 추가
    );
  };
  const handleHotelTagClick = (tag) => {
    setSelectedHotelTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag) // 선택 해제
        : [...prevSelected, tag] // 선택 추가
    );
  };

  const handleTransportationClick = (type) => {
    setTransportation(type);
  };

  const handleNext = () => {
    // 선택된 데이터와 함께 단계 화면으로 이동
    console.log(timeRanges);
    navigate('/loading', { state: { location, startDate, endDate, timeRanges, selectedTags, selectedHotelTags, transportation, accommodationAddress } });
  };

  // 컴포넌트 레드링
  return (
    <div className="create-plan_on">
      {/* 상단 로고 버튼 영역 - 로고 버튼을 눌러스면 메인 페이지로 이동 */}
      <div className="main_menu0_create">
        <div className="upper-box_create">
          <button className="logo-button_create" onClick={() => navigate('/main')} /> {/* 로고 버튼 */}
        </div>
      </div>

      {/* 여행지 입력 영역 */}
      <div className="where_create">
        <h3 className="where_ask_create">어디로 여행가시나요?</h3>
        <div className="input-container_create">
          <input
            className="input-field_create"
            type="text"
            placeholder="어디로 여행을 가시나요?" // 여행지 입력 필드의 플레이스홀더 텍스트
            value={location} // 여행지 상태값을 입력 필드에 바인딩
            onChange={handleInputChange} // 여행지 입력값이 변경될 때 호출되는 함수
          />
          {suggestions.length > 0 && ( // 자동완성 목록이 있을 경우 표시
            <ul className="suggestions-list_create">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index} // 각 항목에 고유한 키 할당
                  onClick={() => handleSuggestionClick(suggestion)} // 항목 클릭 시 여행지 상태를 업데이트하는 함수 호출
                  className="suggestion-item_create"
                >
                  {suggestion} {/* 자동완성 항목 텍스트 */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 여행 기간 입력 영역 */}
      <div className="when_create">
        <h3 className="when_ask_create">일정이 어디까지 되시나요?</h3>

        <DatePicker
          className="datepicker-input" // 날짜 선택기 필드의 클래스명
          selected={startDate} // 출발 날짜 상태값을 선택기로 설정
          onChange={handleStartDateChange} // 출발 날짜가 변경될 때 호출되는 함수
          minDate={today} // 선택 가능한 최소 날짜를 오늘로 설정
          dateFormat="yyyy/MM/dd" // 날짜 형식을 "yyyy/MM/dd"로 설정
          placeholderText="출발 날짜를 선택해주세요" // 날짜 선택기 필드의 플레이스홀 텍스트
          dayClassName={dayClassName} // 각 날짜에 적용할 CSS 클래스명 결정하는 함수
          calendarClassName="custom-calendar" // 달러의 커스텀 스타일 클래스명
        />

        <DatePicker
          className="datepicker-input" // 날짜 선택기 필드의 클래스명
          selected={endDate} // 도착 날짜 상태값을 선택기로 설정
          onChange={handleEndDateChange} // 도착 날짜가 변경될 때 호출되는 함수
          minDate={startDate || today} // 출발 날짜 이후부터 선택 가능
          maxDate={startDate ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null} // 출발 날짜 기준으로 최대 7일 이후까지 선택 가능
          dateFormat="yyyy/MM/dd" // 날짜 형식을 "yyyy/MM/dd"로 설정
          placeholderText="도착 날짜를 선택해주세요 (최대일정 7일)" // 날짜 선택기 필드의 플레이스홀 텍스트
          dayClassName={dayClassName} // 각 날짜에 적용할 CSS 클래스명 결정하는 함수
          calendarClassName="custom-calendar" // 달러의 커스텀 스타일 클래스명
        />
      </div>

      {/* 시간 입력 영역 */}
      <div className="time_create">
        <h3 className="time_ask_create">시간이 어디까지 되시나요?</h3>

        <ul>
          {days.map((day, index) => (
            <li key={index}> {/* 각 날자에 대해 고유한 키를 붙여 */}
              <div>
                <strong>{day.toLocaleDateString()}</strong> {/* 여행 날짜를 표시 */}
                <div>
                  <label>
                    시작 시간:
                    <input
                      type="time" // 시간 입력 필드
                      value={timeRanges[index]?.start || '10:00'} // 시작 시간 값을 설정, 기본값은 '10:00'
                      onChange={(e) => handleTimeChange(index, 'start', e.target.value)} // 시작 시간이 변경될 때 호출되는 함수
                    />
                  </label>
                  <label>
                    종료 시간:
                    <input
                      type="time" // 시간 입력 필드
                      value={timeRanges[index]?.end || '20:00'} // 종료 시간 값을 설정, 기본값은 '20:00'
                      onChange={(e) => handleTimeChange(index, 'end', e.target.value)} // 종료 시간이 변경될 때 호출되는 함수
                    />
                  </label>
                </div>
                {errorMessages[index] && ( // 에러 메시지가 있을 경우 표시
                  <p className="error-message_create">{errorMessages[index]}</p> // 에러 메시지를 사용자에게 표시
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 태그 선택*/}
      <div className='tag_create'>
        <h3 className='tag_ask_create'>
          태그를 선택해주세요
        </h3>
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
      {/* 이동 방식 선택 */}
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
      <h3>호텔을 예약 하셨나요?</h3>
      <div className="hotel_tags_create">
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

      </div>

      <div>
              {/* 숙소 예약 지지 및 입력창 */}
      <h3>이미 숙소를 예약하셨나요?</h3>
      <input
        type="text"
        className="accommodation-input"
        placeholder="예약한 숙소의 주소를 입력하세요"
        value={accommodationAddress}
        onChange={(e) => setAccommodationAddress(e.target.value)}
      />
      </div>

      {/* 일성 생성 */}
      {/* 일정 생성 버튼 클릭 시 handleNext 함수 호출 */}
      <button onClick={handleNext}>
        일정 생성
      </button>
    </div>
  );
}

export default CreatePlan;
