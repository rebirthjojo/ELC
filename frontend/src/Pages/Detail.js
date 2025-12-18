import './Detail.css'
import { useEffect, useRef, useState } from 'react';

function Detail (){

    const [onTap, setOnTap] =useState('one');
    const modalRef = useRef(null);
    const [openStates, setOpenStates] = useState({
        'ts_intro' : false,
        'dev_env': false,
        'basic_type': false,
        'vars_consts': false,
        'generic' : false,
        'Union_Intersection': false,
        'type_guard': false,
        'Project setup' : false,
        'API_type_definition': false,
        'component_type': false,
        });

    const basicItems = [
    { key: 'ts_intro', title: 'TypeScript 소개' },
    { key: 'dev_env', title: '개발 환경 설정' },
    { key: 'basic_type', title: '기본 타입' },
    { key: 'vars_consts', title: '변수와 상수' },
    ];

    const advancedItems = [
    { key: 'generic', title: '제네릭' },
    { key: 'Union_Intersection', title: '유니온과 인터섹션' },
    { key: 'type_guard', title: '타입 가드' },
    ];

    const projectItems = [
    { key: 'Project setup', title: '프로젝트 셋업' },
    { key: 'API_type_definition', title: 'API 타입 정의' },
    { key: 'component_type', title: '컴포넌트 타입' },
    ];

    const handleToggle = (key) =>{
        setOpenStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    
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
                                className="Icon-path"
                                d="M18 12.5C14.75 8.75 9 10.35 9 15.5C9 20.65 14.2 24.5 18 27C21.8
                                24.5 27 20.65 27 15.5C27 10.35 21.25 8.75 18 12.5Z"
                                fill="none"
                                stroke="#6C757D"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>                     
            </div>
            <div className='detailLeftdown'>
                <div className='detail-buttonarea'>
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
                        <div className='basicclassName'>
                            <span>TypeScript기초</span>
                                <ol>
                                    {basicItems.map((item) => (
                                        <li key={item.key} className={openStates[item.key] ? 'selected' : ''}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <svg 
                                                    className={`arrow-icon-triangle ${openStates[item.key] ? 'open' : ''}`}
                                                    onClick={() => handleToggle(item.key)}
                                                    width="16" 
                                                    height="16" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ cursor: 'pointer' }}>
                                                    <path d="M8 5L17 12L8 19V5Z" stroke="#333" strokeWidth="2"/>
                                                </svg>
                                                <span>{item.title}</span> 
                                            </div>                                            
                                            <div className={`sub-list-wrapper ${openStates[item.key] ? 'open' : ''}`}>
                                                <ol>
                                                    {item.key === 'ts_intro' && <li>TS란 무엇인가, TS의 장점</li>}
                                                    {item.key === 'dev_env' && <li>Node.js 설치, VS Code 설정</li>}
                                                    {item.key === 'basic_type' && <li>Number, String, Boolean</li>}
                                                    {item.key === 'vars_consts' && <li>let, const 차이, Hoisting</li>}
                                                </ol>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                        </div>
                        <div className='advancedClassName'>
                            <span>고급 타입</span>
                                <ol>
                                {advancedItems.map((item) => (
                                        <li key={item.key} className={openStates[item.key] ? 'selected' : ''}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <svg 
                                                    className={`arrow-icon-triangle ${openStates[item.key] ? 'open' : ''}`}
                                                    onClick={() => handleToggle(item.key)}
                                                    width="16" 
                                                    height="16" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ cursor: 'pointer' }}>
                                                    <path d="M8 5L17 12L8 19V5Z" stroke="#333" strokeWidth="2"/>
                                                </svg>
                                                <span>{item.title}</span> 
                                            </div>                                            
                                            <div className={`sub-list-wrapper ${openStates[item.key] ? 'open' : ''}`}>
                                                <ol>
                                                    {item.key === 'generic' && <li>TS란 무엇인가, TS의 장점</li>}
                                                    {item.key === 'Union_Intersection' && <li>Node.js 설치, VS Code 설정</li>}
                                                    {item.key === 'type_guard' && <li>Number, String, Boolean</li>}
                                                </ol>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                        </div>
                        <div className='ProjectClassName'>
                            <span>실전 프로젝트</span>
                                <ol>
                                {projectItems.map((item) => (
                                        <li key={item.key} className={openStates[item.key] ? 'selected' : ''}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <svg 
                                                    className={`arrow-icon-triangle ${openStates[item.key] ? 'open' : ''}`}
                                                    onClick={() => handleToggle(item.key)}
                                                    width="16" 
                                                    height="16" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ cursor: 'pointer' }}>
                                                    <path d="M8 5L17 12L8 19V5Z" stroke="#333" strokeWidth="2"/>
                                                </svg>
                                                <span>{item.title}</span> 
                                            </div>                                            
                                            <div className={`sub-list-wrapper ${openStates[item.key] ? 'open' : ''}`}>
                                                <ol>
                                                    {item.key === 'Project setup' && <li>TS란 무엇인가, TS의 장점</li>}
                                                    {item.key === 'API_type_definition' && <li>Node.js 설치, VS Code 설정</li>}
                                                    {item.key === 'component_type' && <li>Number, String, Boolean</li>}
                                                </ol>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                        </div>
                    </div>
                    )}
                {onTap === "two"&&(
                    <div className='course-Introduction'>
                        <span className='course-intro-title'>강의 설명</span>
                        <span className='course-intro-ex'>이 강의는 TypeScript를 처음 시작하는 분들부터 실무에서 
                        활용하고자 하는 분들까지 모두를 위한 완벽한 가이드입니다. 
                        기본 문법부터 고급 패턴까지 단계별로 학습하며, 
                        실제 프로젝트를 통해 실무 능력을 키울 수 있습니다.
                        </span>
                        <span className='course-intro-target'>학습 목표</span>
                        <img alt='체크 아이콘' src='/image/check.svg'></img>
                        <span className='course-intro-first'>TypeScript의 핵심 개념과 문법 이해</span>
                        <img alt='체크 아이콘' src='/image/check.svg'></img>
                        <span className='course-intro-second'>타입 시스템을 활용한 안전한 코드 작성</span>
                        <img alt='체크 아이콘' src='/image/check.svg'></img>
                        <span className='course-intro-third'>실전 프로젝트를 통한 실무 능력 향상</span>                    
                    </div>
                )}
                {onTap === "three"&&( 
                <div className='course-review'>
                    <div className='course-review-detail'>
                        <img alt='구글 로그인 임시 아이콘' src='/image/last_name.svg' />
                        <span className='reviewer'>이수강</span>
                        <span className='reviewdate'>2024.11.20</span>
                        <span className='review'>정말 체계적으로 잘 가르쳐주십니다. TypeScript를 처음 배우는 분들에게 강력 추천합니다.</span>
                        <img src='/image/star.svg' alt='별점 아이콘' className='review-icon' /><span className='review-rating'> 5</span>
                    </div>
                </div>
                )}
                {onTap === "four"&&( 
                <div className='tutor-info'>
                    <img alt='강사 구글 로그인 임시 아이콘' src='/image/tuter_last.svg'></img>
                    <span className='tutor'>김개발</span>
                    <span className='tutor-cor'>풀스택 개발자</span>
                    <span className='tutor-cor-de'>10년 이상의 개발 경험을 바탕으로 실무 중심의 강의를 진행하고 있습니다. TypeScript와 React를 활용한 웹 개발 전문가입니다.</span>
                </div>
                )}
            </div>
            <div className='detailRight'>
                
            </div>
        </div>
    );
}
export default Detail;