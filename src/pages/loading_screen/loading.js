import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './loading.css';

function LoadingScreen() {
  const [progress, setProgress] = useState(0); // 진행률 상태
  const [travelPlans, setTravelPlans] = useState(null); // 서버에서 받은 여행 계획 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  // 전달받은 데이터
  const { state } = useLocation();
<<<<<<< HEAD
  const { location, startDate, endDate, timeRanges, selectedTags, transportation } = state || {};
=======
  const { location, startDate, endDate, timeRanges, selectedTags, selectedHotelTags, transportation, accommodationAddress } = state || {};
>>>>>>> 56612e690813e425f2568e3922e44b780d5a444c

  // 서버로 보낼 데이터
  const requestData = {
    location: location,
    startDate: startDate.toLocaleDateString('en-CA'), // ISO 8601 형식으로 변환
    endDate: endDate.toLocaleDateString('en-CA'),
    timeRanges: timeRanges, // 객체 배열 형태
    selectedTags: selectedTags,
    transportation: transportation,
    selectedHotelTags: selectedHotelTags,
    accommodationAddress: accommodationAddress,
  };

  // 서버로 데이터 전달 및 응답 처리
  const travelplanmaking = () => {
    console.log('전달할 데이터 :', requestData);

    fetch('http://localhost:8080/TravelPlanMaking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('받은 데이터:', data);
          setTravelPlans(data); // 서버에서 받은 여행 계획 데이터 저장
          setLoading(false); // 로딩 상태 해제
        })
        .catch((error) => {
          console.error('데이터 전송 실패:', error);
          setLoading(false); // 로딩 상태 해제
        });
  };

  useEffect(() => {
    // 여행 계획 생성 요청
    travelplanmaking();

    // 진행률 업데이트
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1; // 진행률 증가
        } else {
          clearInterval(interval); // 100% 도달 시 타이머 종료
          return 100;
        }
      });
    }, 100); // 100ms 간격으로 진행률 증가

    return () => {
      clearInterval(interval); // 컴포넌트 언마운트 시 진행률 업데이트 정리
    };
  }, []);

  useEffect(() => {
    // travelPlans가 업데이트되면 화면 이동
    if (travelPlans) {
      navigate('/myplan', { state: { travelPlans } });
    }
  }, [travelPlans, navigate]);

  return (
      <div className="loading-screen">
        {/* 로딩 바와 진행률 텍스트 */}
        <div className="loading-circle-container">
          <div className="loading-circle"></div>
          <div className="progress-text">{`${progress}%`}</div>
        </div>
        <p className="loading-text">{loading ? '일정 생성 중...' : '완료되었습니다!'}</p>
      </div>
  );
}

export default LoadingScreen;
