import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Landmark, Smartphone, Check, Lock } from 'lucide-react';
import { courseInstance } from '../axiosInstance';
import { useAuth } from '../context/AuthContext'; 
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    const [courseData, setCourseData] = useState(null);
    const [totalLectures, setTotalLectures] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            navigate('/');
        }
    }, [isLoggedIn, loading, navigate]);

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                setLoading(true);
                const response = await courseInstance.get('/popular-courses');
                const decodedTitle = decodeURIComponent(title || "").trim();
                const filtered = response.data.filter(item => 
                    (item.lectureName || "").toString().trim() === decodedTitle
                );

                if (filtered.length > 0) {
                    setCourseData(filtered[0]);
                    setTotalLectures(filtered.length);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        if (title) fetchCheckoutData();
    }, [title]);

    if (loading) return <div className="loading-state">인증 및 정보를 확인 중...</div>;
    if (!user || !courseData) return null;

    return (
        <div className="checkout-wrapper">
            <div className="checkout-container">
                <div className="checkout-main">
                    <section className="checkout-section">
                        <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <h2 className="section-title" style={{ margin: 0 }}>주문자 정보</h2>
                            <Lock size={16} className="text-muted" /> 
                            <span style={{ fontSize: '12px', color: '#666' }}>(수정 불가)</span>
                        </div>
                        
                        <div className="readonly-info-group">
                            <div className="info-item">
                                <label>이름</label>
                                <div className="value-field">{user.name}</div>
                            </div>
                            <div className="info-item">
                                <label>이메일</label>
                                <div className="value-field">{user.email}</div>
                            </div>
                            <div className="info-item">
                                <label>연락처</label>
                                <div className="value-field">{user.phone || '등록된 번호 없음'}</div>
                            </div>
                        </div>
                    </section>

                    <section className="checkout-section">
                        <h2 className="section-title">결제 수단 선택</h2>
                    </section>
                </div>

                <aside className="checkout-sidebar">
                    <div className="summary-card">
                        <h2 className="section-title">주문 요약</h2>
                        <div className="course-info">
                            <div className="thumbnail-placeholder">
                                <img src={`/image/${courseData.imageName}`} alt="강의" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div className="course-name">{courseData.lectureName}</div>
                                <div className="instructor-name">{courseData.tutorName}</div>
                            </div>
                        </div>
                        
                        <div className="total-row">
                            <span>최종 결제금액</span>
                            <span className="total-price">₩{courseData.price?.toLocaleString()}</span>
                        </div>
                        
                        <button className="submit-payment-btn" onClick={() => {
                            const paymentData = {
                                userEmail: user.email,
                                courseId: courseData.uid,
                                price: courseData.price
                            };
                            console.log("결제 요청 데이터:", paymentData);
                        }}>
                            결제하기
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;