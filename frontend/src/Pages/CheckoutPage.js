import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Landmark, Smartphone, Check, Lock, ChevronRight } from 'lucide-react';
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
    const [paymentMethod, setPaymentMethod] = useState('card');

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

    const handlePaymentSubmit = async () => {
        if (!window.confirm("정말로 결제를 진행하시겠습니까?")) return;

        const paymentData = {
            email: user.email,
            courseUid: courseData.uid,
            amount: courseData.price,
            method: paymentMethod,
            orderDate: new Date().toISOString()
        };

        try {
            const response = await courseInstance.post('/orders', paymentData);
            
            if (response.status === 200 || response.status === 201) {
                alert("결제가 완료되었습니다! 수강 목록으로 이동합니다.");
                navigate('/my-courses');
            }
        } catch (error) {
            console.error("결제 처리 중 오류:", error);
            alert("결제 처리 중 서버 오류가 발생했습니다.");
        }
    };

    if (loading) return <div className="loading-state">인증 및 정보를 확인 중...</div>;
    if (!user || !courseData) return <div className="no-data">정보를 불러올 수 없습니다.</div>;

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
                        <div className="payment-options-list">
                            <div 
                                className={`payment-option-item ${paymentMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <div className="option-info">
                                    <CreditCard size={20} />
                                    <span>신용/체크카드</span>
                                </div>
                                {paymentMethod === 'card' && <Check size={18} className="check-icon" />}
                            </div>

                            <div 
                                className={`payment-option-item ${paymentMethod === 'transfer' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('transfer')}
                            >
                                <div className="option-info">
                                    <Landmark size={20} />
                                    <span>실시간 계좌이체</span>
                                </div>
                                {paymentMethod === 'transfer' && <Check size={18} className="check-icon" />}
                            </div>

                            <div 
                                className={`payment-option-item ${paymentMethod === 'phone' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('phone')}
                            >
                                <div className="option-info">
                                    <Smartphone size={20} />
                                    <span>휴대폰 결제</span>
                                </div>
                                {paymentMethod === 'phone' && <Check size={18} className="check-icon" />}
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="checkout-sidebar">
                    <div className="summary-card">
                        <h2 className="section-title">주문 요약</h2>
                        
                        <div className="course-info-card">
                            <div className="thumbnail-box">
                                <img 
                                    src={`/image/${courseData.imageName}`} 
                                    alt="강의" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            </div>
                            <div className="course-text">
                                <div className="course-name">{courseData.lectureName}</div>
                                <div className="instructor-name">{courseData.tutorName} 강사</div>
                            </div>
                        </div>

                        <div className="price-details">
                            <div className="price-row">
                                <span>정가</span>
                                <span>₩{courseData.price?.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span>할인 금액</span>
                                <span className="discount-text">- ₩0</span>
                            </div>
                            <div className="divider" />
                            <div className="total-row">
                                <span>최종 결제금액</span>
                                <span className="total-price">₩{courseData.price?.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="terms-notice">
                            위 결제 내용을 확인하였으며, 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                        </div>
                        
                        <button className="submit-payment-btn" onClick={handlePaymentSubmit}>
                            {courseData.price?.toLocaleString()}원 결제하기
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;