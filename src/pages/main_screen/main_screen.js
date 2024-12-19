// src/pages/main_screen/main_screen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import "./main_screen.css";

function MainScreen({ isLoggedIn, onLogout, userEmail }) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showElements, setShowElements] = useState(Array(8).fill(false));
  const navigate = useNavigate();
  const [email, setEmail] = useState(userEmail);   // 로그인한 이메일 상태 관리

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
  
  //회원 탈퇴
  const onDeleteAccount = () => {
    // 경고창을 띄워서 사용자 확인 받기
    const confirmDelete = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?");
    const requestData = { email: email };

    if (confirmDelete) {
      console.log("회원탈퇴 진행 중...");
      console.log("email:", email);  // 이메일 값 확인

      // DeleteAccount 함수에서 Promise를 반환하고 then을 사용하여 후속 작업 처리
      DeleteAccount(requestData).then(response => {
        if (response === true) {
          // 서버에서 true를 받았을 때만 로그아웃 및 이메일 null 설정
          onLogout();   // 로그아웃 처리
          setEmail(null); // 이메일을 null로 설정
          console.log("회원탈퇴가 완료되었습니다.");
        } else {
          // 서버에서 실패한 경우 처리
          console.error("회원탈퇴에 실패했습니다.");
        }
      }).catch(error => {
        console.error("회원탈퇴 중 오류 발생:", error);
      });
    } else {
      // "아니요" 버튼을 눌렀을 때 취소 처리
      console.log("회원탈퇴가 취소되었습니다.");
    }
  };

  const DeleteAccount = (requestData) => {
    return fetch('http://localhost:8080/unregister', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),  // 이메일을 JSON 형식으로 요청 본문에 포함
    })
        .then(response => {
          if (!response.ok) {
            throw new Error("서버 응답 오류");
          }
          return response.json();  // 응답을 JSON으로 파싱
        })
        .then(data => {
          if (data === true) {
            return true;
          } else {
            throw new Error("회원탈퇴 실패");
          }
        })
        .catch(error => {
          console.error("데이터 삭제 중 오류 발생:", error);
          throw error;  // 오류를 다시 던져서 외부에서 처리
        });
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
                 <span className="text1">여행계획을 자동 생성해드립니다</span>
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
                <span className="text">내 플랜</span>
                <span className="text1">이전에 생성한 여행계획을 볼 수 있습니다</span>
              </button>
          )}
        </div>

        <div className={`accordion ${isAccordionOpen ? 'open' : ''}`}>
          <button className="close-btn fade-in" onClick={toggleAccordion}>X</button>
          <div className="a">
            {isLoggedIn ? (
                // <button className="my-plan-accordion-button fade-in" onClick={onLogout}>
                //   로그아웃
                // </button>
                <>
                  <button className="my-plan-accordion-button fade-in" onClick={onLogout}>
                    로그아웃
                  </button>
                  <button className="my-plan-accordion-button fade-in" onClick={onDeleteAccount}>
                    회원탈퇴
                  </button>
                </>

            ) : (
                <button className="login-accordion-button fade-in" onClick={handleLoginRedirect}>
                  로그인
                </button>
            )}
            <div className="b">
              <button className="ask-accordion-button fade-in" onClick={() => navigate('/contact')}>문의하기</button>
              <button className="ask-accordion-button fade-in" onClick={() => navigate('/contact')}>공지사항</button>
            </div>
          </div>
        </div>

        <div className={`accordion-overlay ${isAccordionOpen ? 'visible' : ''}`} onClick={toggleAccordion}></div>
      </div>
  );
}

export default MainScreen;