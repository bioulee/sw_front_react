import React, { useState } from 'react'; // React와 useState 훅을 가져옴
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 가져옴
import DatePicker from 'react-datepicker'; // 날짜 선택기를 위한 라이브러리 가져옴
import 'react-datepicker/dist/react-datepicker.css'; // 날짜 선택기의 스타일 가져옴
import "./main_screen.css"; // 해당 컴포넌트의 스타일 가져옴

// 한글 지명을 영문으로 변환하는 함수
const koreanToRomanized = (korean) => {
  const romanizationMap = { // 한글 지명과 대응하는 영문 지명 매핑
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

  return romanizationMap[korean] || korean; // 매핑에 없는 경우 원본 문자열 반환
};

function MainScreen() { // 메인 화면 컴포넌트 정의
  const [location, setLocation] = useState(''); // 여행지 입력값 상태 관리
  const [startDate, setStartDate] = useState(null); // 출발 날짜 상태 관리
  const [endDate, setEndDate] = useState(null); // 도착 날짜 상태 관리
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // 아코디언 열림/닫힘 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리 (기본적으로 로그아웃 상태)

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 가져옴
  const today = new Date(); // 현재 날짜 가져옴

  const [suggestions, setSuggestions] = useState([]); // 자동완성 목록 상태 관리
  const destinations = ['서울', '부산', '제주', '강릉', '대구', '인천', '속초', '전주', '성남']; // 여행지 목록

  const handleSuggestionClick = (suggestion) => { // 자동완성 항목 클릭 핸들러
    setLocation(suggestion); // 클릭된 항목으로 입력값 설정
    setSuggestions([]); // 자동완성 목록 숨기기
  };

  const handleInputChange = (e) => { // 여행지 입력 변경 핸들러
    const input = e.target.value; // 입력값 가져옴
    setLocation(input); // 입력값으로 상태 업데이트

    if (input) { // 입력값이 있는 경우
      const isHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(input); // 입력값이 한글인지 확인
      const inputRomanized = input.toLowerCase(); // 영문 입력을 소문자로 변환

      // 자동완성 목록 필터링
      const filteredSuggestions = destinations.filter((destination) => {
        const romanizedDestination = koreanToRomanized(destination).toLowerCase(); // 한글을 영문으로 변환
        const destinationRomanized = romanizedDestination || destination.toLowerCase();

        // 입력값과 여행지 이름의 일치 여부 확인
        if (isHangul) {
          return destination.includes(input); // 한글 입력일 경우 매칭
        } else {
          return romanizedDestination.includes(inputRomanized) || destination.toLowerCase().includes(inputRomanized); // 영문 입력일 경우 매칭
        }
      });

      setSuggestions(filteredSuggestions); // 필터링된 목록으로 상태 업데이트
    } else {
      setSuggestions([]); // 입력값이 없으면 목록 초기화
    }
  };

  const handleStartDateChange = (date) => { // 출발 날짜 변경 핸들러
    setStartDate(date); // 출발 날짜 설정
    setEndDate(null); // 출발 날짜가 변경되면 도착 날짜 초기화
  };

  const handleEndDateChange = (date) => { // 도착 날짜 변경 핸들러
    setEndDate(date); // 도착 날짜 설정
  };

  const dayClassName = (date) => { // 날짜에 클래스명을 추가하는 함수
    const diffInDays = (date - today) / (1000 * 60 * 60 * 24); // 오늘부터의 날짜 차이 계산
    return diffInDays >= -1 && diffInDays < 9 ? 'highlighted-red' : null; // 10일 이내면 특별한 클래스명 반환
  };

  // 입력된 여행지가 목록에 포함되어 있는지 확인하는 함수
  const isLocationValid = () => {
    return destinations.some((destination) => {
      const [koreanName, romanizedName] = destination.split(' / ');
      return location === koreanName || location === romanizedName;
    });
  };

  const isFormValid = location && startDate && endDate && isLocationValid(); // 여행지, 출발일, 도착일이 모두 입력되고 여행지가 유효한지 확인

  const toggleAccordion = () => { // 아코디언 열림/닫힘 토글 함수
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleLoginRedirect = () => { // 로그인 페이지로 리다이렉트하는 함수
    navigate('/login');
  };

  const handleSubmit = () => { // 일정 생성 버튼 클릭 시 동작
    if (isLoggedIn) {
      if (isLocationValid()) { // 여행지가 유효한 경우만 일정 생성 진행
        navigate('/createplan', { state: { location, startDate, endDate } });
      } else {
        alert('유효하지 않은 여행지입니다. 올바른 여행지를 선택해주세요.');
      }
    } else {
      handleLoginRedirect(); // 로그인이 안 된 경우 로그인 페이지로 리다이렉트
    }
  };

  return ( // JSX 반환
    <div className="main-screen"> {/* 메인 화면 컨테이너 */}
      <div className="upper-box"> {/* 상단 버튼 영역 */}
        <button className="logo-button" onClick={() => navigate('/main')} /> {/* 로고 버튼 */}
        <button className="details-button" onClick={toggleAccordion}></button> {/* 상세 버튼 */}
      </div>

      <h3 className='header0'>여행계획이 고민이신가요?</h3> {/* 질문 텍스트 */}
      <div className="choice_box"> {/* 여행 계획 입력 컨테이너 */}
        <div className="input-container"> {/* 입력 필드 컨테이너 */}
          <input
            className="input-field"
            type="text"
            placeholder="어디로 여행을 가시나요?" // 여행지 입력창 플레이스홀더
            value={location} // 입력값 바인딩
            onChange={handleInputChange} // 입력값 변경 핸들러
          />
          {suggestions.length > 0 && ( // 자동완성 목록 표시
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => ( // 자동완성 항목 생성
                <li
                  key={index} // 고유 키
                  onClick={() => handleSuggestionClick(suggestion)} // 클릭 시 여행지 설정
                  className="suggestion-item"
                >
                  {suggestion} {/* 여행지 이름 */}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DatePicker
          className="datepicker-input"
          selected={startDate} // 출발 날짜
          onChange={handleStartDateChange} // 출발 날짜 변경 핸들러
          minDate={today} // 오늘 이후 날짜만 선택 가능
          dateFormat="yyyy/MM/dd" // 날짜 형식 설정
          placeholderText="출발 날짜를 선택해주세요" // 플레이스홀더
          dayClassName={dayClassName} // 날짜에 클래스 추가
          calendarClassName="custom-calendar" // 커스텀 달력 클래스명
        />

        <DatePicker
          className="datepicker-input"
          selected={endDate} // 도착 날짜
          onChange={handleEndDateChange} // 도착 날짜 변경 핸들러
          minDate={startDate || today} // 출발일 이후만 선택 가능
          maxDate={startDate ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null} // 출발일 기준 7일 이내로 제한
          dateFormat="yyyy/MM/dd" // 날짜 형식 설정
          placeholderText="도착 날짜를 선택해주세요 (최대일정 7일)" // 플레이스홀더
          dayClassName={dayClassName} // 날짜에 클래스 추가
          calendarClassName="custom-calendar" // 커스텀 달력 클래스명
        />

        <button
          className="submit-button"
          onClick={handleSubmit} // 일정 생성 시 로그인 여부 확인 후 동작
          disabled={!isFormValid} // 폼 유효성 검사
        >
          일정 생성 {/* 버튼 텍스트 */}
        </button>
      </div>

      <div>
        <button className='record-button' onClick={() => navigate('/record')}>
          내플렌 {/* 버튼 텍스트 */}
        </button>
      </div>

      {/* 아코디언 UI */}
      <div className={`accordion ${isAccordionOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleAccordion}>X</button>
        <div>
          <button className="login-accordion-button" onClick={handleLoginRedirect}>로그인</button>
          <button className="ask-accordion-button" onClick={() => navigate('/contact')}>문의하기</button>
          <button className="ask-accordion-button" onClick={() => navigate('/contact')}>공지사항</button>
        </div>
      </div>

      {/* 오버레이 (아코디언이 열릴 때 화면에 회색으로 덮어줌) */}
      <div className={`accordion-overlay ${isAccordionOpen ? 'visible' : ''}`} onClick={toggleAccordion}></div>
    </div>
  );
}

export default MainScreen;
