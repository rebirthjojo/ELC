import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = ({ courseUid }) => {
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [writer, setWriter] = useState('');

    // 리뷰 불러오기 함수
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

    // 리뷰 저장 함수
    const handleSubmit = async () => {
        if (!content.trim() || !writer.trim()) return alert("내용을 입력해주세요.");
        try {
        await axios.post('http://localhost:8080/api/reviews', {
            courseUid,
            writer,
            content,
            rating: Number(rating)
        });
        setContent('');
        fetchReviews();
        } catch (error) {
        alert("등록 실패");
        }
    };

    return (
        <div className="review-wrapper">
        {/* 입력창 영역 */}
        <div style={{ padding: '20px', border: '1px solid #eee', marginBottom: '20px' }}>
            <input 
            placeholder="작성자" 
            value={writer} 
            onChange={e => setWriter(e.target.value)} 
            style={{ marginRight: '10px' }}
            />
            <select value={rating} onChange={e => setRating(e.target.value)}>
            <option value="5">5점</option>
            <option value="4">4점</option>
            <option value="3">3점</option>
            </select>
            <textarea 
            style={{ width: '100%', marginTop: '10px', display: 'block' }}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="수강평을 남겨주세요."
            />
            <button onClick={handleSubmit} style={{ marginTop: '10px' }}>등록</button>
        </div>

        {/* 리스트 영역 */}
        {reviews.map(r => (
            <div key={r.uid} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <div><strong>{r.writer}</strong> | {"⭐".repeat(r.rating)}</div>
            <div>{r.content}</div>
            <small>{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
        ))}
        </div>
    );
};

export default ReviewSection;