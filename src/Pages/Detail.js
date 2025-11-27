import './Detail.css'
import { useEffect, useRef, useState } from 'react';

function Detail (){

    const [onTap, setOnTap] =useState('one');
    const modalRef = useRef(null);
    
    const activeClass = 'active';
    const handleTapClick = (tapname) =>{
        setOnTap(tapname);
        }

    useEffect(() => {
        const handleClickOutside = (event) =>{
            if (modalRef.current && !modalRef.current.contains(event.target)){
                event.preventDefault();
                event.stopPropagation();                
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);        

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
            
        };
    },[]);

    return(
        <div id='detailBase'>
            <div className='detailLeftup'>
                <div className='explanarea'>
                    <div className='bestseller'>
                        베스트셀러
                    </div>
                    <span className='courseTitle'>TypeScript 완벽 가이드</span>
                    <span className='detailex'>기초부터 고급 기능까지, TypeScript
                            의 모든 것을 배워보세요. 실무에 바
                            로 적용할 수 있는 프로젝트와 함께 합니다.
                    </span>
                    <img src='/image/star.svg' alt='별점 아이콘' className='rating-icon'></img><span className='rating'>4.9 (3421개 평가)</span>
                    <img src='/image/persons.svg' alt='사람 아이콘' className='persons-icon'></img><span className='studentnum'>23,450명이 수강중</span>
                    <span className='tutor'>강사:</span><span className='tutor-name'> 김개발</span>
                </div>
                <div className='Imagearea'>
                    <div className='ggimIcon-detail'>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="17.5" fill="#F0F0F0" stroke="#E0E0E0"/>
                            <path 
                                className="heart-path"
                                d="M18 12.5C14.75 8.75 9 10.35 9 15.5C9 20.65 14.2 24.5 18 27C21.8
                                24.5 27 20.65 27 15.5C27 10.35 21.25 8.75 18 12.5Z"
                                fill="none"
                                stroke="#6C757D"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                </div>                     
            </div>
            <div className='detailLeftdown'>
                <div>
                    <button className={`tap-button ${onTap === "one" ? activeClass:''}`}
                    onClick={()=>handleTapClick("one")}>커리큘럼</button>
                    <button className={`tap-button ${onTap === "two" ? activeClass:''}`}
                    onClick={()=>handleTapClick("two")}>강의 소개</button>
                    <button className={`tap-button ${onTap === "three" ? activeClass:''}`}
                    onClick={()=>handleTapClick("three")}>수강평</button>
                    <button className={`tap-button ${onTap === "four" ? activeClass:''}`}
                    onClick={()=>handleTapClick("four")}>강사 정보</button>
                </div>
                 {onTap === "one"&&(
                    <div className='course-Expl'>
                        <div className='basicclassName'></div>
                        <div className='advancedClassName'></div>
                        <div className='ProjectClassName'></div>
                    </div>
                    )}
                {onTap === "two"&&(
                    <div className='course-Introduction'>
                        <span>강의 설명</span>
                        <span>이 강의는 TypeScript를 처음 시작하는 분들부터 실무에서 
                        활용하고자 하는 분들까지 모두를 위한 완벽한 가이드입니다. 
                        기본 문법부터 고급 패턴까지 단계별로 학습하며, 
                        실제 프로젝트를 통해 실무 능력을 키울 수 있습니다.
                        </span>
                        <span>학습 목료</span>
                        <img></img><span>TypeScript의 핵심 개념과 문법 이해</span>
                        <img></img><span>타입 시스템을 활용한 안전한 코드 작성</span>
                        <img></img><span>실전 프로젝트를 통한 실무 능력 향상</span>                    
                    </div>
                )}
                {onTap === "three"&&( 
                <div className='course-review'>
                    <div className='course-review-detail'>
                        <img></img>
                        <span>이수강</span>
                        <span>2024.11.20</span>
                        <span>정말 체계적으로 잘 가르쳐주십니다. TypeScript를 처음 배우는 분들에게 강력 추천합니다.</span>
                        <img></img>
                    </div>
                </div>
                )}
                {onTap === "four"&&( 
                <div className='tutor-info'>
                    <img></img>
                    <span>김개발</span>
                    <span>풀스택 개발자</span>
                    <span>10년 이상의 개발 경험을 바탕으로 실무 중심의 강의를 진행하고 있습니다. TypeScript와 React를 활용한 웹 개발 전문가입니다.</span>
                </div>
                )}
            </div>
            <div className='detailRight'>
                
            </div>
        </div>
    );
}
export default Detail;