import './Detail.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseInstance } from '../axiosInstance'; 

function Detail() {
    const { title } = useParams(); 
    const [onTap, setOnTap] = useState('one');
    const [courseList, setCourseList] = useState([]); 
    const [mainInfo, setMainInfo] = useState(null);   
    const [loading, setLoading] = useState(true);
    
    const [videoTimes, setVideoTimes] = useState({});
    const [totalSeconds, setTotalSeconds] = useState(0);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await courseInstance.get('/popular-courses'); 
                const data = response.data;
                const decodedTitle = decodeURIComponent(title || "").trim();

                const filtered = data.filter(item => 
                    (item.lectureName || "").toString().trim() === decodedTitle
                );

                setCourseList(filtered);
                if (filtered.length > 0) setMainInfo(filtered[0]);
                setLoading(false);
            } catch (error) {
                console.error("데이터 로딩 중 오류:", error);
                setLoading(false);
            }
        };
        if (title) fetchCourseData();
    }, [title]);

    useEffect(() => {
        const calculateTimes = async () => {
            if (courseList.length === 0) return;

            const timeResults = {};
            let accumulatedSec = 0;

            const promises = courseList.map((item) => {
                return new Promise((resolve) => {
                    if (!item.videoAddress) {
                        resolve({ uid: item.uid, timeStr: "--:--", sec: 0 });
                        return;
                    }

                    const video = document.createElement('video');
                    video.src = item.videoAddress;
                    video.preload = 'metadata';

                    video.onloadedmetadata = () => {
                        const duration = Math.floor(video.duration);
                        const minutes = Math.floor(duration / 60);
                        const seconds = duration % 60;
                        const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        resolve({ uid: item.uid, timeStr, sec: duration });
                    };

                    video.onerror = () => {
                        console.warn(`Video load error: ${item.videoAddress}`);
                        resolve({ uid: item.uid, timeStr: "--:--", sec: 0 });
                    };

                    setTimeout(() => resolve({ uid: item.uid, timeStr: "--:--", sec: 0 }), 3000);
                });
            });

            const results = await Promise.all(promises);
            results.forEach(res => {
                timeResults[res.uid] = res.timeStr;
                accumulatedSec += res.sec;
            });

            setVideoTimes(timeResults);
            setTotalSeconds(accumulatedSec);
        };

        calculateTimes();
    }, [courseList]);

    const formatTotalTime = () => {
        if (totalSeconds === 0) return "계산 중...";
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
    };

    const handleVideoPopup = (url) => {
        if(!url) return alert("미리보기 영상이 준비되지 않았습니다.");
        window.open(url, '_blank', 'width=1000,height=600,noopener,noreferrer');
    };

    if (loading) return <div className="loading-state">데이터를 불러오는 중...</div>;
    if (!mainInfo) return <div className="no-data">강의 정보를 찾을 수 없습니다.</div>;

    return (
        <div id='detailBase'>
            <div className='detail-container'>
                <div className='detail-main-content'>
                    <div className='detailLeftup'>
                        <div className='explanarea'>
                            <div className='bestseller'>베스트셀러</div>
                            <h1 className='courseTitle'>{mainInfo.lectureName}</h1>
                            <p className='detailex'>{mainInfo.lectureIntroduction}</p>
                            
                            <div className='info-grid'>
                                <span className='info-icon'>⭐</span>
                                <span className='info-text'>4.9 (3421개 평가)</span>
                                <span className='info-icon'>👥</span>
                                <span className='info-text'>23,450명이 수강중</span>
                                <span className='info-icon'>👨‍🏫</span>
                                <span className='info-text'>강사: {mainInfo.tutorName}</span>
                            </div>
                        </div>
                        <div className='Imagearea'>
                            <img src={`/image/${mainInfo.imageName}`} alt="강의이미지" />
                            <div className='ggimIcon-detail'>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="17.5" fill="rgba(255, 255, 255, 0.8)" stroke="#E0E0E0" />
                                    <path
                                        className="heart-path"
                                        d="M18 12.5C14.75 8.75 9 10.35 9 15.5C9 20.65 14.2 24.5 18 27C21.8 24.5 27 20.65 27 15.5C27 10.35 21.25 8.75 18 12.5Z"
                                        fill="none"
                                        stroke="#6C757D"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='detailLeftdown'>
                        <div className='detail-buttonarea'>
                            <button className={`tap-button ${onTap === "one" ? 'active' : ''}`} onClick={() => setOnTap("one")}>커리큘럼</button>
                            <button className={`tap-button ${onTap === "two" ? 'active' : ''}`} onClick={() => setOnTap("two")}>강의 소개</button>
                            <button className={`tap-button ${onTap === "three" ? 'active' : ''}`} onClick={() => setOnTap("three")}>수강평</button>
                            <button className={`tap-button ${onTap === "four" ? 'active' : ''}`} onClick={() => setOnTap("four")}>강사 정보</button>
                        </div>

                        <div className='tab-content-wrapper'>
                            {onTap === "one" && (
                                <div className='curriculum-container'>
                                    <div className='curriculum-header'>
                                        <span className='section-title'>{mainInfo.lectureName}</span>
                                        <span className='section-info'>
                                            {courseList.length}개 강의 · 총 {formatTotalTime()}
                                        </span>
                                    </div>

                                    <ul className='curriculum-list'>
                                        {courseList.map((item) => (
                                            <li key={item.uid} className='curriculum-item'>
                                                <div className='item-left'>
                                                    <span className='play-icon'>▷</span>
                                                    <span className='lecture-name'>{item.detailedLectureName}</span>
                                                    <button className='preview-badge' onClick={() => handleVideoPopup(item.videoAddress)}>
                                                        미리보기
                                                    </button>
                                                </div>
                                                <div className='item-right'>
                                                    <span className='lecture-time'>
                                                        {videoTimes[item.uid] || "--:--"}
                                                    </span> 
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {onTap === "two" && (
                                <div className='course-introduction-v2'>
                                    <h2 className='intro-main-title'>{mainInfo.lectureName}</h2>
                                    <p className='intro-sub-title'>강의 소개</p>
                                    
                                    <div className='intro-content-box'>
                                        <p className='intro-text'>
                                            {mainInfo.lectureIntroduction}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {onTap === "three" && <div className='course-review-v2'>아직 작성된 수강평이 없습니다.</div>}
                            {onTap === "four" && <div className='tutor-info-v2'>강사: {mainInfo.tutorName}</div>}
                        </div>
                    </div>
                </div>
                
                <div className='detail-sidebar'>
                    {/* 결제창 내용 */}
                </div>
            </div>
        </div>
    );
}

export default Detail;