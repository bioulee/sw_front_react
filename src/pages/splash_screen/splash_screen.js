import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mainLogo from '../../img/mainlogo.png';  // 이미지 경로
import './splash_screen.css';

function screen(){
  return (
    <div className="splash-screen">
      <img src={mainLogo} alt="Main Logo" className="splash-logo" />
    </div>
  );
}


function SplashScreen() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/main'); // 3초 후에 main 화면으로 이동
    }, 3000);
    return () => clearTimeout(timer);  // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return screen();
}

export default SplashScreen;
