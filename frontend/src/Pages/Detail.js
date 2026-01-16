import './Detail.css';
import ReviewSection from './ReviewSection';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, BookOpen, Award, FileText } from 'lucide-react';
import { courseInstance, authInstance } from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

function Detail() {
    const { uid } = useParams();
    const { token } = useAuth();
    const [onTap, setOnTap] = useState('one');
    const [courseList, setCourseList] = useState([]); 
    const [mainInfo, setMainInfo] = useState(null);   
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    const difficultyMap = {
        'easy': '초급',
        'normal': '중급',
        'hard': '고급'
    };

    const handleWishlist = async (e) => {
        e.stopPropagation();
        
        if (!token) {
            alert("로그인이 필요한 서비스입니다.");
            return navigate('/login');
        }

        try {
            await authInstance.post(`/wishlist/${uid}`);
            alert("관심 강의로 등록되었습니다!");
            navigate('/Wishlist');
        } catch (error) {
            console.error("찜하기 실패:", error);
            alert("이미 등록되었거나 오류가 발생했습니다.");
        }
    };
    
    const CheckClick = () => {
        if (!token) {
            alert("수강 신청은 로그인 후 가능합니다.");
            return navigate('/login');
        }
        navigate(`/Checkout/${encodeURIComponent(mainInfo.lectureName)}`);
    };

    const fetchCourseData = useCallback(async () => {
        if (!uid) return;

        try {
        setLoading(true);
        
        const response = await courseInstance.get(`/${uid}`); 
        const data = response.data;
        setMainInfo(data);

        const relatedRes = await courseInstance.get(`/related`, {
            params: { lectureName: data.lectureName }
        });

        if (relatedRes.data && relatedRes.data.length > 0) {
            setCourseList(relatedRes.data);
        } else {
            setCourseList([data]);
        }

            setLoading(false);
        } catch (error) {
            console.error("데이터 로딩 중 오류:", error);
            setLoading(false);
        }
    }, [uid]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

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

                            <div className='ggimIcon-detail' onClick={handleWishlist}>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="17.5" fill="#ffffff" fillOpacity="0.8" stroke="#E0E0E0" />
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
                                            전체 {courseList.length}개 강의
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
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {onTap === "two" && (
                                <div className='course-introduction'>
                                    <h2 className='intro-main-title'>{mainInfo.lectureName}</h2>
                                    <p className='intro-sub-title'>강의 소개</p>
                                    <div className='intro-content-box'>
                                        <p className='intro-text'>{mainInfo.lectureIntroduction}</p>
                                    </div>
                                </div>
                            )}

                            {onTap === "three" && (
                                <div className='course-review'>
                                    <ReviewSection courseUid={mainInfo.courseUid || mainInfo.uid} />
                                </div>
                            )}
                                                                                                                        
                            {onTap === "four" && <div className='tutor-info'>강사 : {mainInfo.tutorName}</div>}
                        </div>
                    </div>
                </div>
                
                <div className='detail-sidebar'>
                    <div className="sticky-container">
                        <div className="sticky-label">수강료</div>
                        <div className="sticky-price">
                            ₩{mainInfo.price ? mainInfo.price.toLocaleString() : '0'}
                        </div>
                        
                        <button className="sticky-apply-btn" onClick={CheckClick}>수강 신청하기</button>
                        <div className="sticky-divider" />

                        <div className="sticky-info-row">
                            <div className="sticky-icon-text"><BookOpen size={18}/> <span>강의 수</span></div>
                            <span className="sticky-info-value">{courseList.length}개</span>
                        </div>
                        
                        <div className="sticky-info-row">
                            <div className="sticky-icon-text"><Award size={18}/> 
                                <span>난이도</span>
                            </div>
                            <span className="sticky-badge">
                                {difficultyMap[mainInfo.difficulty] || '정보없음'}
                            </span>
                        </div>
                        
                        <div className="sticky-info-row">
                            <div className="sticky-icon-text"><FileText size={18}/> 
                                <span>마지막 업데이트</span>
                            </div>
                            <span className="sticky-info-value">
                                {mainInfo.updateTime ? mainInfo.updateTime.split('T')[0] : '최근'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail;