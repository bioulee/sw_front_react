import React from 'react';
import { useNavigate } from 'react-router-dom';
import './myrecord.css';

const MyPlan = () => {
    const navigate = useNavigate();

    // 테스트를 위한 기본 플랜 목록 (3가지 항목)
    const plans = [
        { planName: '여행 계획 1', cityName: '서울', date: '2024-12-01' },
        { planName: '여행 계획 2', cityName: '부산', date: '2024-12-02' },
        { planName: '여행 계획 3', cityName: '제주', date: '2024-12-03' },
    ];

    // 플랜 항목 클릭 시 /record 페이지로 이동 및 로그 다르게 출력
    const handlePlanClick = (cityName) => {
        console.log(`${cityName} 플랜이 클릭되었습니다.`);
        navigate('/record');
    };

    return (
        <div className="container">
            <h1>내 플랜 목록</h1>
            <h2>저장된 플랜 목록</h2>
            <ul>
                {plans.map((plan, index) => (
                    <li key={index} onClick={() => handlePlanClick(plan.cityName)} className="plan-item">
                        <strong>플랜 이름:</strong> {plan.planName} <br />
                        <strong>도시 이름:</strong> {plan.cityName} <br />
                        <strong>저장 날짜:</strong> {plan.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyPlan;