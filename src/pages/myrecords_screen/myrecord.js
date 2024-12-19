
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './myrecord.css';

// const MyPlan = ({ userEmail  }) => {
//     const navigate = useNavigate();
//     console.log(userEmail)
//     // 테스트를 위한 기본 플랜 목록 (3가지 항목)
//     const plans = [
//         { planName: '여행 계획 1', cityName: '서울', date: '2024-12-01' },
//         { planName: '여행 계획 2', cityName: '부산', date: '2024-12-02' },
//         { planName: '여행 계획 3', cityName: '제주', date: '2024-12-03' },
//     ];
//
//     // 플랜 항목 클릭 시 /record 페이지로 이동 및 로그 다르게 출력
//     const handlePlanClick = (cityName) => {
//         console.log(`${cityName} 플랜이 클릭되었습니다.`);
//         navigate('/record');
//     };
//
//     return (
//         <div className="container">
//             <h1>내 플랜 목록</h1>
//             <h2>저장된 플랜 목록</h2>
//             <ul>
//                 {plans.map((plan, index) => (
//                     <li key={index} onClick={() => handlePlanClick(plan.cityName)} className="plan-item">
//                         <strong>플랜 이름:</strong> {plan.planName} <br />
//                         <strong>도시 이름:</strong> {plan.cityName} <br />
//                         <strong>저장 날짜:</strong> {plan.date}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

function MyPlan({ userEmail }) {
    const [email, setEmail] = useState(userEmail); // 예시 이메일
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const requestData = { email: email };

        fetch('http://localhost:8080/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData), // 이메일을 body에 담아 전송
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // 응답 데이터 확인
                setPlans(data); // 서버로부터 받은 여행 계획 데이터 설정
            })
            .catch(error => {
                console.error("Error fetching data", error);
            });
    }, [email]);

    const myplan = (id) => {
        const requestData = { email: email,id: id };
        fetch('http://localhost:8080/myplan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData), // 이메일을 body에 담아 전송
        })
            .then(response => response.json())  // 서버 응답을 JSON으로 변환
            .then(data => {
                console.log("data : ",data);  // 응답 데이터 확인
                setPlans(data);  // 서버로부터 받은 여행 계획 데이터 설정
                navigate('/record', { state: { data, email, id  } });
            })
            .catch(error => {
                console.error("Error fetching data", error);  // 오류 처리
            });
    }


    // 플랜 항목 클릭 시 /record 페이지로 이동 및 로그 다르게 출력
    const handlePlanClick = (id) => {
        console.log(`${id}번 플랜이 클릭되었습니다.`);
        myplan(id);

    };

    return (
        <div className="container">
            <h1>내 플랜 목록</h1>
            <h2>저장된 플랜 목록</h2>
            {Array.isArray(plans) && plans.length > 0 ? (
                <ul>
                    {plans.map(plan => (
                        <li key={plan.id} onClick={() => handlePlanClick(plan.id)} className="plan-item">
                            {/*<strong>플랜 아이디:</strong> {plan.id}<br/>*/}
                            <strong>플랜 이름:</strong> {plan.saveName}<br/>
                            {/*<strong>저장 날짜:</strong> {plan.createdAt}*/}
                            <strong>저장 날짜:</strong> {new Date(plan.createdAt).toLocaleDateString('ko-KR')}
                            <br/>
                        </li>

                    ))}

                </ul>
            ) : (
                <p>여행 계획이 없습니다.</p>
            )}
        </div>
    );
}

export default MyPlan;