import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mainLogo from '../../img/mainlogo.png'; // 이미지 경로
import './splash_screen.css';

function SplashScreen() {
  const navigate = useNavigate();
  const [moveLogo, setMoveLogo] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMoveLogo(true); // 3초 후에 로고 이동 시작
    }, 3000);

    const timer2 = setTimeout(() => {
      navigate('/main'); // 4초 후에 main 화면으로 이동
    }, 4000);

    return () => {
      clearTimeout(timer1); // 컴포넌트 언마운트 시 타이머 정리
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
      <div className={`splash-screen`}>
        <img
            src={mainLogo}
            alt="Main Logo"
            className={`splash-logo_splash ${moveLogo ? 'move' : ''}`}
        />
      </div>
  );
}

export default SplashScreen;