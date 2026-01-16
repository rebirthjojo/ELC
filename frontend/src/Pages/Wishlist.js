import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authInstance, paymentInstance } from '../axiosInstance';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const fetchWishlist = useCallback(async () => {
        if (!token || !user?.uid) {
            setLoading(false);
            return;
        }

        try {
            const response = await paymentInstance.get(`/wishlist?uid=${user.uid}`);
            
            const mappedData = response.data.map(item => ({
                courseUid: item.courseUid || item.uid,
                lectureName: item.lectureName || item.lecture_name || "강의명 없음",
                tutorName: item.tutorName || item.tutor_name || "강사 정보 없음",
                imageName: item.imageName || item.image_name,
                price: Number(item.price) || 0,
                difficulty: item.difficulty || 'easy'
            }));

            setWishlist(mappedData);
        } catch (error) {
            console.error("찜 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }, [token, user?.uid]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const removeWishItem = async (courseUid) => {
        if (!window.confirm("이 강의를 즐겨찾기에서 삭제하시겠습니까?")) return;
        try {
            await authInstance.delete(`/wishlist/${courseUid}`);
            setWishlist(prev => prev.filter(item => item.courseUid !== courseUid));
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };

    const clearAllWishlist = async () => {
        if (wishlist.length === 0) return;
        if (!window.confirm("즐겨찾기 목록을 모두 비우시겠습니까?")) return;
        try {
            await authInstance.delete('/wishlist/all'); 
            setWishlist([]);
        } catch (error) {
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

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
                                            e.stopPropagation();
                                            removeWishItem(item.courseUid);
                                        }}>🗑️</button>
                                        <span className="badge">{item.difficulty === 'easy' ? '초급' : '중급'}</span>
                                    </div>
                                    <div className="card-info">
                                        <div className="card-text-top">
                                            <h3>{item.lectureName}</h3>
                                            <p className="tutor-name">{item.tutorName}</p>
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
                                <button onClick={() => navigate('/Main')}>강의 보러가기</button>
                            </div>
                        )}
                    </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Wishlist;