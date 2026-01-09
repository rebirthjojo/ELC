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
            console.log("1. 결제 페이지 로딩 시작 - 제목:", title);
            try {
                const authValid = await checkAuthStatus();
                console.log("2. 인증 확인 결과:", authValid);
                
                if (!authValid) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate('/');
                    return;
                }

                console.log("3. 강의 데이터 호출 시작");
                const response = await courseInstance.get('/popular-courses');
                console.log("4. 서버 응답 데이터:", response.data);

                const decodedTitle = decodeURIComponent(title || "").trim();
                const filtered = response.data.filter(item => 
                    (item.lectureName || "").toString().trim() === decodedTitle
                );

                if (filtered.length > 0) {
                    console.log("5. 매칭된 강의 데이터:", filtered[0]);
                    setCourseData(filtered[0]);
                } else {
                    console.error("5. 매칭 실패 - 강의명을 확인하세요:", decodedTitle);
                    alert("해당 강의 정보를 찾을 수 없습니다.");
                    navigate(-1);
                }
            } catch (error) {
                console.error("데이터 로딩 중 에러 발생:", error);
                alert("정보를 불러오는 데 실패했습니다.");
            } finally {
                console.log("6. 모든 로딩 프로세스 종료");
                setLoading(false);
            }
        };

        if (title) {
            initCheckout();
        } else {
            setLoading(false);
            console.warn("전달된 title 파라미터가 없습니다.");
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
                alert("결제가 완료되었습니다!");
                navigate('/my-courses'); 
            }
        } catch (error) {
            alert("결제 처리 중 서버 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return (
            <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
                <div className="loading-state">결제 정보를 불러오는 중입니다...</div>
                <button onClick={() => setLoading(false)} style={{ fontSize: '12px', color: '#999', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>
                    로딩이 너무 길어지나요? 강제 해제하기
                </button>
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
                            <div className="info-item"><label>이름</label><div className="value-field">{user.name}</div></div>
                            <div className="info-item"><label>이메일</label><div className="value-field">{user.email}</div></div>
                            <div className="info-item"><label>연락처</label><div className="value-field">{user.phone || '등록된 번호 없음'}</div></div>
                        </div>
                    </section>

                    <section className="checkout-section">
                        <h2 className="section-title">결제 수단 선택</h2>
                        <div className="payment-options-list">
                            {['card', 'transfer', 'phone'].map((m) => (
                                <div key={m} className={`payment-option-item ${paymentMethod === m ? 'active' : ''}`} onClick={() => setPaymentMethod(m)}>
                                    <div className="option-info">
                                        {m === 'card' && <CreditCard size={20} />}
                                        {m === 'transfer' && <Landmark size={20} />}
                                        {m === 'phone' && <Smartphone size={20} />}
                                        <span>{m === 'card' ? '신용/체크카드' : m === 'transfer' ? '실시간 계좌이체' : '휴대폰 결제'}</span>
                                    </div>
                                    {paymentMethod === m && <Check size={18} className="check-icon" />}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="checkout-sidebar">
                    <div className="summary-card">
                        <h2 className="section-title">주문 요약</h2>
                        <div className="course-info-card" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            <div className="thumbnail-box" style={{ width: '100px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={`/image/${courseData.imageName}`} alt="강의" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="course-text">
                                <div className="course-name" style={{ fontWeight: 'bold' }}>{courseData.lectureName}</div>
                                <div className="instructor-name" style={{ fontSize: '13px', color: '#666' }}>{courseData.tutorName} 강사</div>
                            </div>
                        </div>
                        <div className="price-details" style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between' }}><span>정가</span><span>₩{courseData.price?.toLocaleString()}</span></div>
                            <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between' }}><span>할인 금액</span><span style={{ color: '#ef4444' }}>- ₩0</span></div>
                            <div className="divider" style={{ height: '1px', backgroundColor: '#eee', margin: '15px 0' }} />
                            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>최종 결제금액</span>
                                <span className="total-price" style={{ color: '#2563eb', fontSize: '20px' }}>₩{courseData.price?.toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="submit-payment-btn" onClick={handlePaymentSubmit} style={{ width: '100%', padding: '16px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
                            {courseData.price?.toLocaleString()}원 결제하기
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;