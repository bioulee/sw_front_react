import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mainLogo from '/Users/biou/Documents/sw_proj_react/src/img/logo.png';  // 이미지 경로

import './login.css';

function LoginScreen() {
  const [email, setEmail] = useState(''); // 이메일 입력값 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 입력값 상태 관리
  const [error, setError] = useState(''); // 에러 메시지 상태 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 가져옴

  const handleLogin = () => {
    // 간단한 유효성 검사 (데모용으로 사용자가 "user@example.com" 과 "password123" 인 경우 로그인 성공)
    if (email === 'user@example.com' && password === 'password123') {
      setError('');
      navigate('/main'); // 로그인 성공 시 메인 페이지로 이동
    } else {
      setError('비밀번호를 확인해주세요.'); // 로그인 실패 시 에러 메시지 표시
    }
  };

  return (
    <div className="login-screen">
        <img src={mainLogo} alt="Main Logo" className="logo0" />

      <div className="login-container">
        <input
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field0"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field0"
        />
        {error && <div className="error-message">{error}</div>} {/* 에러 메시지 표시 */}
        <button className="login-button" onClick={handleLogin}>로그인 하기</button>
      </div>
      <div className="signup-prompt">
        회원이 아니신가요? <span onClick={() => navigate('/signup')} className="signup-link">회원가입 하기</span>
      </div>
    </div>
  );
}

export default LoginScreen;
