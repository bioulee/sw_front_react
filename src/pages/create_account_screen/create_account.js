import React, { useState } from 'react';
import './create_account.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);

    const handleEmailVerification = () => {
        // 이메일 인증 코드를 요청하고 전송하는 로직
        alert('인증 코드가 이메일로 전송되었습니다.');
        setIsVerified(true); // 실제 서비스에서는 인증 성공 여부를 업데이트
    };

    const handleSignup = () => {
        if (isVerified) {
            // 회원가입 처리 로직
            alert('회원가입이 완료되었습니다.');
        } else {
            alert('이메일 인증을 완료해주세요.');
        }
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <div className="form-group">
                <label htmlFor="email">이메일</label>
                <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={handleEmailChange} 
                    placeholder="example@domain.com" 
                    required 
                />
                <button className="verify-button" onClick={handleEmailVerification}>
                    이메일 인증
                </button>
            </div>
            <div className="form-group">
                <label htmlFor="verificationCode">인증 코드</label>
                <input 
                    type="text" 
                    id="verificationCode" 
                    value={verificationCode} 
                    onChange={handleVerificationCodeChange} 
                    placeholder="인증 코드를 입력하세요" 
                    required 
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                    placeholder="비밀번호를 입력하세요" 
                    required 
                />
            </div>
            <button className="signup-button" onClick={handleSignup}>
                아이디 생성
            </button>
        </div>
    );
};

export default Signup;