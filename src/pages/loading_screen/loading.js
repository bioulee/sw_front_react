import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './loading.css'

function LoadingScreen() {
  const [progress, setProgress] = useState(0); // 진행률 상태
  const navigate = useNavigate();

  // 전달받은 데이터
  const { state } = useLocation();
  const { location, startDate, endDate, timeRanges, selectedTags, transportation  } = state || {};
  // 전달 데이터
  const requestData = {
    location: location,
    startDate: startDate.toLocaleDateString("en-CA"), // ISO 8601 형식으로 변환
    endDate: endDate.toLocaleDateString("en-CA"),
    timeRanges: timeRanges, // 객체 배열 형태
    selectedTags: selectedTags,
    transportation: transportation,
  };


  //서버로 데이터 전달
  const travelplanmaking = () => {
    console.log('전달할 데이터 :', requestData);

    //서버로 데이터 전송
    fetch("http://localhost:8080/TravelPlanMaking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include", // 인증 정보를 포함하려면 추가
    });
  };

  useEffect(() => {
    travelplanmaking();

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1; // 5%씩 증가
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 100); // 1초 간격

    // 로딩이 끝나면 다음 화면으로 이동
    const timeout = setTimeout(() => {
      navigate('/myplan'); // 다음 화면 경로 설정
    }, 10000); // 20초 후 이동


    return () => {

      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="loading-screen">
      {/* 로딩 바와 진행률 텍스트 분리 */}
      <div className="loading-circle-container">
        <div className="loading-circle"></div>
        {/* 진행률 숫자 */}
        <div className="progress-text">{`${progress}%`}</div>
      </div>
      {/* 로딩 메시지 */}
      <p className="loading-text">일정 생성중...</p>
    </div>
  );
  

}

export default LoadingScreen;
