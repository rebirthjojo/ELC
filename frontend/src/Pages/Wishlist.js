import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authInstance } from '../axiosInstance';
import './Wishlist.css';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. 찜 목록 데이터 불러오기
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                // 백엔드 GET /api/wishlist 호출
                const response = await authInstance.get('/wishlist');
                setWishlist(response.data);
            } catch (error) {
                console.error("찜 목록 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    // 2. 개별 찜 삭제 처리
    const removeWishItem = async (courseUid) => {
        if (!window.confirm("이 강의를 즐겨찾기에서 삭제하시겠습니까?")) return;
        
        try {
            // 백엔드 DELETE /api/wishlist/{courseUid} 호출
            await authInstance.delete(`/wishlist/${courseUid}`);
            // 삭제 후 화면 업데이트
            setWishlist(wishlist.filter(item => item.courseUid !== courseUid));
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };

    // 3. 전체 삭제 처리
    const clearAllWishlist = async () => {
        if (wishlist.length === 0) return;
        if (!window.confirm("즐겨찾기 목록을 모두 비우시겠습니까?")) return;

        try {
            // 백엔드에 전체 삭제 API가 있다면 호출 (없다면 반복문으로 처리 가능)
            // 여기서는 예시로 반복 삭제 혹은 전용 API 호출을 가정합니다.
            await authInstance.delete('/wishlist/all'); 
            setWishlist([]);
        } catch (error) {
            console.error("전체 삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 4. 총 금액 계산
    const totalPrice = wishlist.reduce((acc, cur) => acc + (cur.price || 0), 0);

    if (loading) return <div className="loading-state">데이터를 불러오는 중입니다...</div>;

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <h2>❤️ 즐겨찾기</h2>
                    <span className="count-text">전체 {wishlist.length}개</span>
                </div>

                <div className="wishlist-main">
                    {/* 왼쪽: 강의 카드 리스트 */}
                    <div className="wishlist-list">
                        {wishlist.length > 0 ? (
                            wishlist.map((item) => (
                                <div key={item.courseUid} className="wish-card" onClick={() => navigate(`/Detail/${item.courseUid}`)}>
                                    <div className="card-image">
                                        <img 
                                            src={item.imageName ? `/image/${item.imageName}` : '/image/default_course.png'} 
                                            alt={item.lectureName} 
                                            onError={(e) => e.target.src = '/image/default_course.png'}
                                        />
                                        <button className="delete-btn" onClick={(e) => {
                                            e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                                            removeWishItem(item.courseUid);
                                        }}>🗑️</button>
                                        <span className="badge">{item.difficulty === 'easy' ? '초급' : '중급'}</span>
                                    </div>
                                    <div className="card-info">
                                        <div className="card-text-top">
                                            <h3>{item.lectureName}</h3>
                                            <p className="tutor-name">{item.tutorName}</p>
                                            <div className="card-stats">
                                                <span>⭐ 4.9</span> <span>👥 2.3만</span> <span>🕒 32시간</span>
                                            </div>
                                        </div>
                                        <div className="card-text-bottom">
                                            <div className="card-price">₩{item.price?.toLocaleString()}</div>
                                            <button className="apply-btn-mini">수강하기</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-msg-box">
                                <p className="empty-msg">즐겨찾기한 강의가 없습니다.</p>
                                <button onClick={() => navigate('/courses')}>강의 보러가기</button>
                            </div>
                        )}
                    </div>

                    {/* 오른쪽: 선택한 강의 요약 */}
                    <div className="wishlist-summary">
                        <div className="summary-box">
                            <h4>선택한 강의</h4>
                            <div className="summary-items">
                                {wishlist.map(item => (
                                    <div key={item.courseUid} className="summary-row">
                                        <span className="item-name">{item.lectureName}</span>
                                        <span className="item-price">₩{item.price?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <hr className="summary-divider" />
                            <div className="summary-total">
                                <span className="total-count">총 {wishlist.length}개 강의</span>
                                <div className="total-price-row">
                                    <span>총 금액</span>
                                    <span className="price-blue">₩{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <button className="checkout-all-btn" onClick={() => navigate('/Checkout/all')}>전체 구매하기</button>
                            <button className="clear-all-btn" onClick={clearAllWishlist}>전체 삭제</button>
                            <div className="footer-tip">
                                💡 즐겨찾기한 강의는 언제든지 확인하고 구매할 수 있습니다.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Wishlist;