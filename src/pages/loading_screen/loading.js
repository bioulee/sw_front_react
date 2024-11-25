import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/Users/biou/Documents/sw_proj_react/src/pages/loading_screen/loading.css'

function LoadingScreen() {
  const [progress, setProgress] = useState(0); // 진행률 상태
  const navigate = useNavigate();

  useEffect(() => {
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
