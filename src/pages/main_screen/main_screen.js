// src/pages/main_screen/main_screen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./main_screen.css";

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

function MainScreen({ isLoggedIn, onLogout }) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showElements, setShowElements] = useState(Array(8).fill(false));
  const navigate = useNavigate();

  useEffect(() => {
    const timeouts = [];
    showElements.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setShowElements((prev) => {
          const newShowElements = [...prev];
          newShowElements[index] = true;
          return newShowElements;
        });
      }, index * 500);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handlePlannerClick = () => {
    if (isLoggedIn) {
      navigate('/createplan');
    } else {
      handleLoginRedirect();
    }
  };

  const handleRecordClick = () => {
    if (isLoggedIn) {
      navigate('/myrecord');
    } else {
      handleLoginRedirect();
    }
  };

  return (
      <div className="main_screen_on">
        <div className='main_menu0'>
          <div className="upper-box">
            {showElements[0] && <button className="logo-button fade-in" onClick={() => navigate('/main')} />}
            {showElements[1] && <button className="details-button fade-in" onClick={toggleAccordion}></button>}
          </div>
        </div>

        <div className='main_menu1'>
          {showElements[2] && (
              <h3 className='0_agonize fade-in'>
                여행 계획이 고민이시나요?
              </h3>
          )}

          {showElements[3] && (
              <h3 className='1_solution fade-in'>
                여기 위플에 해답이 있습니다
              </h3>
          )}

          {showElements[4] && (
              <button
                  className="submit-button fade-in"
                  onClick={handlePlannerClick}
              >
                 <span className="text">ai 통합 여행플레너 제작하기</span>
                 <span className="text1">소수의 태그만 선택하면 여행계획을 자동 생성해드립니다</span>
              </button>
          )}
        </div>

        <div className='main_menu2'>
          {showElements[5] && (
              <h3 className='0_remind fade-in'>
                이미 일정을 제작 하셨나요?
              </h3>
          )}

          {showElements[6] && (
              <button
                  className="rec-button  fade-in"
                  onClick={handleRecordClick}
              >
                <span className="text">내 플렌</span>
                <span className="text1">이전에 생성한 여행계획을 볼 수 있습니다</span>
              </button>
          )}
        </div>

        <div className={`accordion ${isAccordionOpen ? 'open' : ''}`}>
          <button className="close-btn fade-in" onClick={toggleAccordion}>X</button>
          <div>
            {isLoggedIn ? (
                <button className="my-plan-accordion-button fade-in" onClick={onLogout}>
                  로그아웃
                </button>
            ) : (
                <button className="login-accordion-button fade-in" onClick={handleLoginRedirect}>
                  로그인
                </button>
            )}
            <div>
              <button className="ask-accordion-button fade-in" onClick={() => navigate('/contact')}>문의하기</button>
              <button className="notice-accordion-button fade-in" onClick={() => navigate('/contact')}>공지사항</button>
            </div>
          </div>
        </div>

        <div className={`accordion-overlay ${isAccordionOpen ? 'visible' : ''}`} onClick={toggleAccordion}></div>
      </div>
  );
}

export default MainScreen;