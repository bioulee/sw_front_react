import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 가져옴
import './create_account.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 상태 관리
    const [verificationCode, setVerificationCode] = useState('');
    const [enteredVerificationCode, setEnteredVerificationCode] = useState(''); // 사용자가 입력한 인증 코드 상태 관리
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(''); // 에러 메시지 상태 관리
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 가져옴

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value); // 비밀번호 확인 입력 핸들러
    const handleVerificationCodeChange = (e) => setEnteredVerificationCode(e.target.value);

    // 서버로 이메일 검증 코드 요청
    const sendEmailVerification = (email) => {
        console.log(email)
        const requestData = { mail: email }; // 이메일 주소만 포함한 객체 생성

        fetch('http://localhost:8080/mailSend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData), // 이메일 주소만 전송
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('이메일로 인증코드 보내기 :',data);
            })
            .catch((error) => {
                console.error('데이터 전송 실패:', error);
            });
    };

    // 서버로 이메일 검증 코드 요청
    const checkEmailVerification = (email,enteredVerificationCode) => {
        console.log(email)
        const requestData = { 
            mail: email,
            enteredVerificationCode: enteredVerificationCode,
        }; // 이메일 주소, 입력한 검증 코드 전송

        return fetch('http://localhost:8080/mailCheck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData), // 이메일 주소,검증코드 전송
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to verify');
                return response.json();
            })
            .then((data) => data)
            .catch((error) => {
                console.error('Verification error:', error);
                throw error;
            });
    };

    const handleEmailVerification = () => {
        sendEmailVerification(email);
        // 이메일 인증 코드를 요청하고 전송하는 로직
        const generatedCode = '123456'; // 실제 서비스에서는 서버에서 생성된 코드 사용
        setVerificationCode(generatedCode);
        alert('인증 코드가 이메일로 전송되었습니다.');
    };

    const handleSignup = async () => {
        if (!enteredVerificationCode) {
            setError('인증 코드를 입력해주세요.');
            return;
        }

        if (!password) {
            setError('비밀번호를 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.'); // 비밀번호 불일치 시 에러 메시지 설정
            return;
        }

        try {
            // 서버로 이메일 인증 코드 체크 (비동기)
            const verificationResult = await checkEmailVerification(email, enteredVerificationCode);
            console.log("인증 진행 중:", verificationResult);

            if (!verificationResult) {
                // 인증 실패 시
                setError('인증 코드를 다시 확인해주세요.');
                return;
            }

            // 인증 성공
            setError('');
            alert('회원가입이 완료되었습니다.');
            navigate('/main'); // 회원가입 완료 시 메인 페이지로 이동
        } catch (error) {
            console.error('인증 과정에서 오류 발생:', error);
            setError('인증 과정에서 문제가 발생했습니다. 다시 시도해주세요.');
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
                    value={enteredVerificationCode}
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
            <div className="form-group">
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                />
            </div>
            {error && <div className="error-message">{error}</div>} {/* 에러 메시지 표시 */}
            <button className="signup-button" onClick={handleSignup} disabled={!email || !verificationCode || !password || !confirmPassword}>
                아이디 생성
            </button>
        </div>
    );
};

export default Signup;