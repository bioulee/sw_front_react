import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './create_plan.css'

function CreatePlan() {
  const { state } = useLocation(); // 전달받은 데이터
  const { location, startDate, endDate } = state || {};
  const navigate = useNavigate();

  const days = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    days.push(new Date(currentDate)); // 여행 기간의 각 날짜 추가
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const [timeRanges, setTimeRanges] = useState(
    days.map(() => ({ start: '10:00', end: '20:00' })) // 기본값: 오전 10시 ~ 오후 8시
  );

  const [errorMessages, setErrorMessages] = useState(
    days.map(() => null) // 초기 에러 메시지
  );

  const handleTimeChange = (index, field, value) => {
    const updatedTimeRanges = [...timeRanges];
    updatedTimeRanges[index][field] = value;

    // 유효성 검사
    const start = updatedTimeRanges[index].start;
    const end = updatedTimeRanges[index].end;
    let errorMessage = null;

    if (field === 'start' && value >= end) {
      errorMessage = '시작 시간은 종료 시간보다 빠를 수 없습니다.';
    }
    if (field === 'end' && value <= start) {
      errorMessage = '종료 시간은 시작 시간보다 느려야 합니다.';
    }

    const updatedErrors = [...errorMessages];
    updatedErrors[index] = errorMessage;
    setErrorMessages(updatedErrors);

    setTimeRanges(updatedTimeRanges);
  };

  const isFormValid = errorMessages.every((msg) => msg === null);

  const handleSubmit = () => {
    if (!isFormValid) {
      alert('시간 설정에 오류가 있습니다.');
      return;
    }

    navigate('/choicetag', { state: { location, startDate, endDate, timeRanges } });
  };

  return (
    <div className="create-plan">
      <h2>{location}에서의 여행 계획</h2>
      <ul>
        {days.map((day, index) => (
          <li key={index}>
            <div>
              <strong>{day.toLocaleDateString()}</strong>
              <div>
                <label>
                  시작 시간:
                  <input
                    type="time"
                    value={timeRanges[index].start}
                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                  />
                </label>
                <label>
                  종료 시간:
                  <input
                    type="time"
                    value={timeRanges[index].end}
                    onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                  />
                </label>
              </div>
              {errorMessages[index] && (
                <p className="error-message">{errorMessages[index]}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        다음 단계로
      </button>
    </div>
  );
}

export default CreatePlan;
