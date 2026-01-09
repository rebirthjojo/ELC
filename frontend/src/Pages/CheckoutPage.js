import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Landmark, Smartphone, Check, Lock } from 'lucide-react';
import { courseInstance } from '../axiosInstance';
import { useAuth } from '../context/AuthContext'; 
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    
    const { user, isSignIn, checkAuthStatus } = useAuth();

    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('card');

    useEffect(() => {
        const initCheckout = async () => {
            try {
                setLoading(true);
                
                const authValid = await checkAuthStatus();
                
                if (!authValid) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate('/');
                    return;
                }

                const response = await courseInstance.get('/popular-courses');
                const decodedTitle = decodeURIComponent(title || "").trim();
                const filtered = response.data.filter(item => 
                    (item.lectureName || "").toString().trim() === decodedTitle
                );

                if (filtered.length > 0) {
                    setCourseData(filtered[0]);
                } else {
                    alert("강의 정보를 찾을 수 없습니다.");
                    navigate(-1);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                alert("서버 통신 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (title) {
            initCheckout();
        }
    }, [title, checkAuthStatus, navigate]);

    const handlePaymentSubmit = async () => {
        if (!window.confirm("정말로 결제를 진행하시겠습니까?")) return;

        const paymentData = {
            email: user?.email,
            courseUid: courseData?.uid,
            amount: courseData?.price,
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

    if (loading) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="loading-state">결제 정보를 불러오는 중입니다...</div>
            </div>
        );
    }

    if (!isSignIn || !user || !courseData) {
        return <div className="no-data">잘못된 접근이거나 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="checkout-wrapper">
            <div className="checkout-container">
                <div className="checkout-main">
                    
                    <section className="checkout-section">
                        <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <h2 className="section-title" style={{ margin: 0 }}>주문자 정보</h2>
                            <Lock size={18} className="text-muted" /> 
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
                        
                        <div className="course-info-card" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            <div className="thumbnail-box" style={{ width: '100px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img 
                                    src={`/image/${courseData.imageName}`} 
                                    alt="강의" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            </div>
                            <div className="course-text">
                                <div className="course-name" style={{ fontWeight: 'bold', fontSize: '15px' }}>{courseData.lectureName}</div>
                                <div className="instructor-name" style={{ fontSize: '13px', color: '#666' }}>{courseData.tutorName} 강사</div>
                            </div>
                        </div>

                        <div className="price-details" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>정가</span>
                                <span>₩{courseData.price?.toLocaleString()}</span>
                            </div>
                            <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>할인 금액</span>
                                <span style={{ color: '#ef4444' }}>- ₩0</span>
                            </div>
                            <div className="divider" style={{ height: '1px', backgroundColor: '#eee', margin: '15px 0' }} />
                            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                <span style={{ fontWeight: 'bold' }}>최종 결제금액</span>
                                <span className="total-price" style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                                    ₩{courseData.price?.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <p className="terms-notice" style={{ fontSize: '11px', color: '#999', marginTop: '20px', textAlign: 'center', lineHeight: '1.4' }}>
                            위 결제 내용을 확인하였으며, 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                        </p>
                        
                        <button className="submit-payment-btn" onClick={handlePaymentSubmit} style={{
                            width: '100%', padding: '16px', backgroundColor: '#111827', color: 'white',
                            border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold',
                            cursor: 'pointer', marginTop: '20px'
                        }}>
                            {courseData.price?.toLocaleString()}원 결제하기
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;