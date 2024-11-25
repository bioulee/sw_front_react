import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/Users/biou/Documents/sw_proj_react/src/pages/choice_tag_screen/choice_tag.css'

function SelectPreferences() {
  const navigate = useNavigate();

  // 관광 유형 태그
  const tagOptions = [
    '문화유산', '쇼핑', '전통시장', '휴양지', '랜드마크', 
    '자연', '공원', '카지노', '스파', '예술', '테마파크'
  ];

  const [selectedTags, setSelectedTags] = useState([]);
  const [transportation, setTransportation] = useState('대중교통'); // 기본값: 대중교통

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((t) => t !== tag) // 선택 해제
        : [...prevSelected, tag] // 선택 추가
    );
  };

  const handleTransportationClick = (type) => {
    setTransportation(type);
  };

  const handleNext = () => {
    // 선택된 데이터와 함께 다음 화면으로 이동
    navigate('/loading', { state: { selectedTags, transportation } });
  };

  return (
    <div className="preferences-screen">
      {/* 관광 유형 선택 */}
      <h2>원하시는 여행유형을 선택해주세요 (미선택시 모두 적용)</h2>
      <div className="tags-container">
        {tagOptions.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 이동 방식 선택 */}
      <h2>원하시는 이동방식을 선택해주세요</h2>
      <div className="transportation-container">
        <button
          className={`transportation-button ${transportation === '대중교통' ? 'selected' : ''}`}
          onClick={() => handleTransportationClick('대중교통')}
        >
          대중교통
        </button>
        <button
          className={`transportation-button ${transportation === '자가용' ? 'selected' : ''}`}
          onClick={() => handleTransportationClick('자가용')}
        >
          자가용
        </button>
      </div>

      {/* 일정 생성 버튼 */}
      <button className="next-button" onClick={handleNext}>
        일정 생성
      </button>
    </div>
  );
}

export default SelectPreferences;