import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = ({ courseUid }) => {
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [writer, setWriter] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    // 4번: 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews/${courseUid}`);
            setReviews(response.data);
        } catch (error) {
            console.error("리뷰 로딩 에러:", error);
        }
    };

    useEffect(() => {
        if (courseUid) fetchReviews();
    }, [courseUid]);

    // 페이지네이션 계산 로직
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const handleSubmit = async () => {
        if (!content.trim() || !writer.trim()) {
            return alert("작성자와 내용을 모두 입력해주세요.");
        }

        try {
            await axios.post('http://localhost:8080/api/reviews', {
                courseUid: Number(courseUid),
                writer: writer,
                content: content,
                rating: Number(rating)
            });
            
            setContent('');
            setWriter('');
            setRating(5);
            setIsFormVisible(false);
            fetchReviews();
            setCurrentPage(1); // 등록 후 첫 페이지로 이동
            alert("수강평이 등록되었습니다!");
        } catch (error) {
            console.error("등록 에러:", error);
            alert("수강평 등록에 실패했습니다.");
        }
    };

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
                        <input type="text" placeholder="이름" className="review-writer-input" value={writer} onChange={(e) => setWriter(e.target.value)} />
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
                    <textarea placeholder="강의에 대한 솔직한 후기를 남겨주세요." className="review-content-textarea" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                    <div className="form-bottom" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setIsFormVisible(false)} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>취소</button>
                        <button className="review-submit-btn" onClick={handleSubmit}>등록하기</button>
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

            {/* 페이지네이션 버튼 */}
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