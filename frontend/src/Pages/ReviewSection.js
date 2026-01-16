import React, { useState, useEffect, useCallback } from 'react';
import { fetchReviewsAPI, createReviewAPI, authInstance } from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ courseUid }) => {
    const { user, token, isSignIn } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [writer, setWriter] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;
    const [paymentStatus, setPaymentStatus] = useState([]);

    const loadProfileName = useCallback(async () => {
        if (!token) return;

        try {
            const response = await authInstance.get(`/users/me`);
            const data = response.data;
            setWriter(data.name || user?.name || '');

            const myPaidCourses = data.paymentStatus || user?.paidCourses || [];
            
            setPaymentStatus(myPaidCourses);
            console.log("최종 확인된 결제 목록:", myPaidCourses);

        } catch (error) {
            console.error("리뷰 작성자 정보 및 결제 내역 로드 실패:", error);

            setPaymentStatus([]);
        }
    }, [token, user]);

    useEffect(() => {
        if (token) {
            loadProfileName();
        } else {
            setWriter('');
            setPaymentStatus([]);
        }
    }, [token, loadProfileName]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetchReviewsAPI(courseUid);
            setReviews(response.data);
        } catch (error) {
            console.error("리뷰 로딩 에러:", error);
        }
    }, [courseUid]);

    useEffect(() => {
        if (courseUid) fetchReviews();
    }, [courseUid, fetchReviews]);

    const handleSubmit = async () => {
        if (!token) {
            return alert("로그인이 필요한 서비스입니다.");
        }

        if (!paymentStatus) {
        return alert("결제 정보를 확인 중입니다. 잠시만 기다려주세요.");
        }

    
        const isPurchased = paymentStatus.includes(Number(courseUid)) || paymentStatus.includes(String(courseUid));
    
        if (!isPurchased) {
            return alert("강의를 구매하신 분들만 리뷰를 작성할 수 있습니다.");
        }
        
        if (!content.trim() || !writer.trim()) {
            return alert("내용을 입력해주세요.");
        }

        try {
            const response = await createReviewAPI({
                courseUid: Number(courseUid),
                writer: writer,
                content: content,
                rating: Number(rating)
            });

            console.log("등록 성공:", response.data);
            
            setContent('');
            setRating(5);
            setIsFormVisible(false);
            fetchReviews();
            setCurrentPage(1);
            alert("수강평이 등록되었습니다!");
        } catch (error) {
            console.error("등록 에러 상세:", error);
            if (error.response) {
                alert("에러 발생: " + (error.response.data.message || error.response.data));
            } else {
                alert("수강평 등록에 실패했습니다.");
            }
        }
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    return (
        <div className="review-section-container">
            <div className="review-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '20px' }}>수강평 <span className="review-count">{reviews.length}</span></h2>
                {!isFormVisible && (
                    <button className="show-form-btn" onClick={() => setIsFormVisible(true)}>+ 수강평 쓰기</button>
                )}
            </div>

            {isFormVisible && (
                <div className="review-form-box">
                    <div className="form-top">
                        <input 
                            type="text" 
                            placeholder={token ? "이름" : "로그인 필요"} 
                            className="review-writer-input" 
                            value={writer} 
                            readOnly={!!token}
                            disabled={!token}
                            onChange={(e) => setWriter(e.target.value)} 
                            style={ 
                                !token 
                                ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed', color: '#999' } 
                                : { backgroundColor: '#f5f5f5', cursor: 'default' }
                            }
                        />
                        <div className="rating-selection">
                            {[5, 4, 3, 2, 1].map((num) => (
                                <label key={num} className="rating-label">
                                    <input type="radio" name="rating" value={num} checked={rating === num} onChange={() => setRating(num)} />
                                    <div className="star-number-box">
                                        <span className="star-icon">⭐</span>
                                        <span className="number-overlay">{num}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <textarea 
                        placeholder={token ? "강의에 대한 솔직한 후기를 남겨주세요." : "로그인 후 작성이 가능합니다."} 
                        className="review-content-textarea" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        disabled={!token}
                    ></textarea>
                    <div className="form-bottom" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setIsFormVisible(false)} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>취소</button>
                        <button className="review-submit-btn" 
                            onClick={handleSubmit}
                            disabled={!token}
                            style={!token ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >등록하기</button>
                    </div>
                </div>
            )}

            <div className="review-list">
                {currentReviews.length > 0 ? (
                    currentReviews.map(r => (
                        <div key={r.uid} className="review-card">
                            <div className="card-header">
                                <span className="card-writer">{r.writer}</span>
                                <div className="card-stars-wrapper">
                                    <span style={{ fontSize: '12px' }}>⭐</span>
                                    <span className="card-rating-num">{r.rating}</span>
                                </div>
                                <div className="card-body-flexible">{r.content}</div>
                                <span className="card-date">
                                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-reviews">첫 수강평의 주인공이 되어보세요!</div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button 
                            key={pageNum} 
                            className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                            onClick={() => setCurrentPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;