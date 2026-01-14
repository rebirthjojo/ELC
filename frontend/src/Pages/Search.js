import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Search.css';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const searchResults = location.state?.searchResults || [];
    const query = new URLSearchParams(location.search).get('q');

    // 변수명을 lectureName으로 일관되게 정의
    const handleRowClick = (lectureName) => {
        if (!lectureName) return; // 이름이 없을 경우 대비
        navigate(`/Detail/${encodeURIComponent(lectureName)}`); 
    };

    return (
        <div className="search-container">
            <header className="search-header">
                <h1>"<span>{query}</span>" 검색 결과</h1>
                <p>총 {searchResults.length} 개의 강의를 찾았습니다.</p>
            </header>

            {searchResults.length > 0 ? (
                <div className="table-wrapper">
                    <table className="search-table">
                        <thead>
                            <tr>
                                <th className="col-name">강의명</th>
                                <th className="col-intro">강의 소개</th>
                                <th className="col-tutor">강사</th>
                                <th className="col-price">가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((course, index) => (
                                <tr 
                                    key={course.uid || index} 
                                    // onClick에서 사용하는 데이터가 'lecture_name'인지 확인하세요.
                                    onClick={() => handleRowClick(course.lecture_name)} 
                                    className="selectable-row"
                                >
                                    <td className="col-name">{course.lecture_name}</td>
                                    <td className="col-intro">{course.lecture_introduction || "소개 정보가 없습니다."}</td>
                                    <td className="col-tutor">{course.tutor_name || '미지정'}</td>
                                    <td className="col-price">
                                        {course.price ? `₩${Number(course.price).toLocaleString()}` : "가격 정보 없음"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-results">
                    <p>검색 결과가 없습니다. 😢</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;