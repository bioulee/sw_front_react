import React, { useState, useEffect } from "react"; // React와 필요한 훅(useState, useEffect) 가져오기
import { useNavigate, useLocation } from 'react-router-dom';
import './myplan.css'; // 해당 컴포넌트의 스타일 가져오기


function Myplan() { // Myplan 컴포넌트 정의
    const [accordionExpanded, setAccordionExpanded] = useState(false); // 아코디언 확장 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
    const [saveName, setSaveName] = useState(""); // 저장할 이름 상태 관리
    const [isSaveSuccess, setIsSaveSuccess] = useState(false); // 저장 성공 메시지 상태 관리

    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 가져옴

    // useLocation을 사용하여 전달받은 state 데이터 접근
    const { state } = useLocation();
    const travelPlans = state?.travelPlans; // 전달받은 travelPlans 데이터
    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);

        // 날짜를 'MM/DD' 형식으로 포맷
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-based index 보정
        const day = date.getDate().toString().padStart(2, '0');

        // 요일 추출
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];

        return `${month}/${day}(${weekday})`; // 'MM/DD(요일)' 형식
    };
    // 로그로 출력
    console.log('전달받은 데이터:', travelPlans);

    useEffect(() => { // 컴포넌트가 마운트될 때 실행
        const script = document.createElement("script"); // 새로운 스크립트 태그 생성
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBA7J9N7TZa_PWbMFZz7m5gRcFXXu2OulM&callback=initMap`; // Google Maps API 스크립트 설정
        script.async = true; // 비동기로 스크립트 로드
        script.onerror = () => { // 스크립트 로드 실패 시 에러 처리
            console.error("Google Maps JavaScript API를 로드하는 중 오류가 발생했습니다.");
        };
        window.initMap = () => { // Google Maps 초기화 함수 정의
            try {
                const map = new window.google.maps.Map(document.getElementById("map"), { // "map" ID를 가진 요소에 맵 렌더링
                    center: { lat: 37.5665, lng: 126.9780 }, // 지도 중심 좌표 설정 (서울)
                    zoom: 12, // 지도 줌 레벨 설정
                });


                const locations = travelPlans?.flatMap((plan, dayIndex) => {
                    // 여행지 데이터 처리
                    const spots = plan.TotalSpotList?.map((spot, index) => ({
                        lat: spot.SpotLat,
                        lng: spot.SpotLng,
                        name: spot.SpotName,
                        day: dayIndex + 1, // 여행 일자
                    })) || [];

                    // 숙소 데이터를 각 일자 맨 마지막에 추가
                    const hotel = {
                        lat: plan.HotelData.Lat, // 숙소 위도
                        lng: plan.HotelData.Lng, // 숙소 경도
                        name:  "숙소", // 숙소 이름, 기본값 "숙소"
                        day: dayIndex + 1, // 여행 일자
                    };

                    // 여행지 데이터를 모두 추가하고 그 뒤에 숙소 데이터 추가
                    return [...spots, hotel];
                }) || [];


                let dayMarkersCount = { 1: 0, 2: 0, 3: 0 }; // 일자별 마커 개수 관리

                locations.forEach((location) => { // 각 장소에 대해 마커 추가
                    if (location.day > 0) {
                        dayMarkersCount[location.day] = (dayMarkersCount[location.day] || 0) + 1;
                    }
                    const markerColor = location.day === 1 ? "#FF6B6B" : location.day === 2 ? "#4DA8DA" : location.day === 3 ? "#51C059" : "#9B59B6";
                    const markerLabel = location.day > 0 ? dayMarkersCount[location.day].toString() : "";
                    const marker = new window.google.maps.Marker({ // Google Maps 마커 생성
                        position: { lat: location.lat, lng: location.lng }, // 마커 위치 설정
                        map: map, // 마커를 추가할 지도 객체 설정
                        title: location.name, // 마커의 제목 설정
                        label: {
                            text: markerLabel, // 날짜마다 마커 레이블이 1부터 시작
                            color: "white", // 레이블 색상 설정
                            fontWeight: "bold", // 레이블 폰트 굵기 설정
                        },
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: markerColor, // 마커 색상 설정
                            fillOpacity: 1,
                            strokeWeight: 1,
                            scale: 10,
                        },
                    });
                });

                // 일정 사이의 경로를 선으로 연결 (일자별로 다른 색상 적용)
                let dayPaths = { 1: [], 2: [], 3: [] };

                locations.forEach((location) => {
                    if (location.day > 0) {
                        dayPaths[location.day].push({ lat: location.lat, lng: location.lng });
                    }
                });

                Object.keys(dayPaths).forEach((day) => {
                    const strokeColor = day === "1" ? "#FF6B6B" : day === "2" ? "#4DA8DA" : "#51C059";
                    const travelPath = new window.google.maps.Polyline({
                        path: dayPaths[day],
                        geodesic: true,
                        strokeColor: strokeColor,
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });
                    travelPath.setMap(map);
                });
            } catch (error) {
                console.error("지도 초기화 중 오류가 발생했습니다:", error);
            }
        };
        document.body.appendChild(script); // 스크립트를 body에 추가하여 Google Maps API 로드
    }, []); // 의존성 배열이 비어있어 마운트 시 한 번만 실행

    const handleSaveClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSaveName("");
    };

    const handleSaveNameChange = (event) => {
        setSaveName(event.target.value);
    };

    const handleSaveConfirm = () => {
        // 저장 확인 로직 실행 후 저장 성공 메시지 표시
        setIsSaveSuccess(true);
        setTimeout(() => {
            setIsSaveSuccess(false);
            handleModalClose();
        }, 1000); // 1초 동안 메시지 표시 후 모달 닫기
    };

    return (
        <div className="myplan_app"> {/* 메인 앱 컨테이너 */}
            <div id="map" className="myplan_map"></div> {/* 지도 표시 영역 */}
            <div
                className={`myplan_accordion0 ${accordionExpanded ? "expanded" : "collapsed"}`} // 아코디언 상태에 따라 클래스 적용
            >
                <div className="myplan_accordion-header"> {/* 아코디언 헤더 영역 */}
                    <button
                        className="myplan_main-go" // 버튼 클래스 설정
                        onClick={() => navigate('/main')} // 일정 저장 버튼 클릭 시 모달 열기
                    >
                        메인으로 나가기
                    </button>
                    <button
                        onClick={() => setAccordionExpanded((prev) => !prev)} // 클릭 시 아코디언 상태 토글
                        className="myplan_arrow-btn" // 버튼 클래스 설정
                    >
                        {accordionExpanded ? "⬇️" : "⬆️"} {/* 아코디언 상태에 따른 버튼 텍스트 */}
                    </button>
                    <button
                        className="myplan_record-go" // 버튼 클래스 설정
                        onClick={handleSaveClick} // 일정 저장 버튼 클릭 시 모달 열기
                    >
                        일정 저장
                    </button>
                </div>

                <div className="myplan_accordion-content"> {/* 아코디언 내용 영역 */}
                    {/* 여행 정보 섹션 (아코디언 상단에 위치하도록 이동) */}
                    <div className="myplan_travel-info">
                        {/*{travelPlans.map((plan, index) => ())}*/}
                        <div className="myplan_plan-info">
                            <p>
                                총 여행기간:
                                {getFormattedDate(travelPlans[0]?.Date)} [{travelPlans[0]?.DateStartTime}] ~
                                {getFormattedDate(travelPlans[travelPlans.length - 1]?.Date)} [{travelPlans[travelPlans.length - 1]?.DateEndTime}]
                            </p>
                            {/*<p>날씨: {plan.Weather}</p>*/}
                            {/*<p>예상 여행 경비: {plan.HotelData?.expectedCost || '정보 없음'}</p>*/}
                        </div>

                    </div>
                    {travelPlans.map((plan) => ( // data 배열을 순회하며 아코디언 아이템 생성
                        <div>
                            <div className="myplan_accordion-item">
                                <h2>{getFormattedDate(plan.Date)}</h2>
                                <h4>{plan.Weather}</h4>
                            </div>
                            {/* 개별 아코디언 아이템 및 일자 표시 */}
                            {plan.TotalSpotList.map((SpotList, index) => (
                                <div key={index + 1} className="myplan_accordion-item" data-index={index + 1}>
                                    <div className="myplan_item-content"> {/* 아이템 내용 */}
                                        <div className="myplan_item-image-container"> {/* 이미지 컨테이너 */}
                                            <p className="myplan_viewing-time">
                                                {SpotList.SpotStartTime} ~ {SpotList.SpotEndTime}
                                            </p> {/* 방문 시간 표시 */}
                                            <img src={SpotList.SpotPhoto} alt={SpotList.SpotName} /> {/* 장소 이미지 */}
                                        </div>
                                        <div className="myplan_item-details"> {/* 아이템 상세 정보 */}
                                            <div className="myplan_item-header"> {/* 아이템 헤더 */}
                                                <h2>{SpotList.SpotName}</h2> {/* 장소 이름 */}
                                                <div className="myplan_meta-info"> {/* 추가 정보 */}
                                                    <span className="myplan_likes">❤️ {SpotList.SpotTotaltips}</span> {/* 좋아요 수 */}
                                                    <span className="myplan_rating">⭐ {SpotList.SpotRating}</span> {/* 평점 */}
                                                </div>
                                            </div>
                                            <p className="myplan_description">{SpotList.SpotDescription}</p> {/* 장소 설명 */}
                                            <div className="myplan_button-group"> {/* 버튼 그룹 */}
                                                <button className="myplan_route-button">가는법</button> {/* 가는법 버튼 */}
                                                <span className="myplan_travel-time">{SpotList.DirectionTime} min</span> {/* 이동 시간 */}
                                                <button className="myplan_place-details-button">장소상세</button> {/* 장소 상세 버튼 */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="myplan_accordion-item">
                                <div className="myplan_item-details"> {/* 아이템 상세 정보 */}
                                    <div className="myplan_item-header"> {/* 아이템 헤더 */}
                                        <h2>숙소</h2> {/* 장소 이름 */}
                                        <div className="myplan_meta-info"> {/* 추가 정보 */}
                                            <span className="myplan_likes">{plan.HotelData?.Address}</span> {/* 좋아요 수 */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* 모달 오버레이 */}
            {isModalOpen && (
                <div className="myplan_modal-overlay">
                    <div className="myplan_modal">
                        <button className="myplan_close-btn" onClick={handleModalClose}>X</button>
                        <h2>일정 저장</h2>
                        <input
                            type="text"
                            value={saveName}
                            onChange={handleSaveNameChange}
                            placeholder="저장할 이름을 입력하세요"
                        />
                        <button className="myplan_save-btn" onClick={handleSaveConfirm}>저장하기</button>
                    </div>
                </div>
            )}

            {/* 저장 성공 메시지 */}
            {isSaveSuccess && (
                <div className="myplan_modal-overlay">
                    <div className="myplan_modal">
                        <p>저장되었습니다!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const data = [ // 아코디언에 표시할 데이터 배열
    // 1일차
    {
        id: 1, // 데이터 고유 ID
        time: "10:00 ~ 12:00", // 방문 시간
        title: "롯데타워", // 장소 이름
        description: "롯데타워는 서울에 위치한 123층, 555m 높이의 대한민국 최고층 빌딩으로, 쇼핑, 문화, 호텔, 전망대 등 다양한 시설을 갖춘 랜드마크입니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 12500, // 좋아요 수
        rating: 9.5, // 평점
        travelTime: 15, // 이동 시간(분)
    },
    {
        id: 2, // 데이터 고유 ID
        time: "12:15 ~ 13:25", // 방문 시간
        title: "만돈", // 장소 이름
        description: "만돈은 프리미엄 흑돼지 전문점으로, 질 좋은 제주산 흑돼지와 다양한 한식 요리를 고급스럽게 제공합니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 450, // 좋아요 수
        rating: 9.3, // 평점
        travelTime: 20, // 이동 시간(분)
    },
    {
        id: 3, // 데이터 고유 ID
        time: "13:45 ~ 18:15", // 방문 시간
        title: "코엑스", // 장소 이름
        description: "코엑스는 서울 강남에 위치한 대형 전시·컨벤션 센터이자 쇼핑, 문화, 엔터테인먼트가 결합된 복합 문화 공간입니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 9200, // 좋아요 수
        rating: 9.4, // 평점
        travelTime: 5, // 이동 시간(분)
    },
    // 2일차
    {
        id: 4, // 데이터 고유 ID
        time: "09:00 ~ 11:00", // 방문 시간
        title: "경복궁", // 장소 이름
        description: "경복궁은 서울에 위치한 조선 왕조의 법궁으로, 전통적인 궁궐 건축과 한국 역사의 중요한 현장입니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 15000, // 좋아요 수
        rating: 9.7, // 평점
        travelTime: 10, // 이동 시간(분)
    },
    {
        id: 5, // 데이터 고유 ID
        time: "11:15 ~ 13:00", // 방문 시간
        title: "북촌한옥마을", // 장소 이름
        description: "북촌한옥마을은 서울에 위치한 전통 한옥들이 모여 있는 마을로, 한국의 전통 생활문화를 경험할 수 있는 곳입니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 8000, // 좋아요 수
        rating: 9.6, // 평점
        travelTime: 15, // 이동 시간(분)
    },
    {
        id: 6, // 데이터 고유 ID
        time: "13:15 ~ 15:00", // 방문 시간
        title: "인사동", // 장소 이름
        description: "인사동은 서울에 위치한 전통 문화와 현대 예술이 어우러진 거리로, 다양한 갤러리와 공예품 가게가 있습니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 7300, // 좋아요 수
        rating: 9.2, // 평점
        travelTime: 10, // 이동 시간(분)
    },
    // 3일차
    {
        id: 7, // 데이터 고유 ID
        time: "10:00 ~ 12:00", // 방문 시간
        title: "남산타워", // 장소 이름
        description: "남산타워는 서울의 대표적인 관광명소로, 서울 전경을 한눈에 볼 수 있는 전망대입니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 14000, // 좋아요 수
        rating: 9.8, // 평점
        travelTime: 15, // 이동 시간(분)
    },
    {
        id: 8, // 데이터 고유 ID
        time: "12:15 ~ 13:30", // 방문 시간
        title: "명동", // 장소 이름
        description: "명동은 서울의 쇼핑과 맛집이 모여 있는 번화가로, 다양한 먹거리와 쇼핑을 즐길 수 있는 장소입니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 11000, // 좋아요 수
        rating: 9.5, // 평점
        travelTime: 20, // 이동 시간(분)
    },
    {
        id: 9, // 데이터 고유 ID
        time: "13:45 ~ 15:00", // 방문 시간
        title: "청계천", // 장소 이름
        description: "청계천은 서울 도심을 가로지르는 복원된 하천으로, 도심 속 자연을 느낄 수 있는 산책로입니다.", // 장소 설명
        image: "https://via.placeholder.com/150", // 이미지 URL
        likes: 9000, // 좋아요 수
        rating: 9.3, // 평점
        travelTime: 10, // 이동 시간(분)
    },
];

export default Myplan; // Myplan 컴포넌트를 다른 파일에서 사용할 수 있도록 내보내기
