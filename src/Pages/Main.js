import './Main.css'
import { useNavigate } from "react-router-dom";
import React, {useState} from 'react';

const Main = ()=>{

    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState('전체');

    const handlecourseClick = () =>{
        navigate ("/Detail");
    };
    
    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
    };

    const categories = [
        {name: '전체', icon: null},
        {name:'개발', icon: "/image/entire1.png" , alt:"개발아이콘"},
        {name:'디자인', icon: "/image/design1.png", alt:"디자인아이콘"},
        {name:'비지니스', icon: "/image/business1.png", alt:"비지니스아이콘"},
        {name:'마케팅', icon: "/image/marketing1.png", alt:"마케팅아이콘"},
        {name:'사진', icon: "/image/picture1.png", alt:"사진아이콘"},
        {name:'음악', icon: "/image/music1.png", alt:"음악아이콘"},
        
    ];

    const adContents = [
        {iconSrc: "/image/student1.png", altText: "학생아이콘", text1: "500,000+", text2: "활동 중인 수강생" },
        {iconSrc: "/image/course1.png", altText: "강의아이콘", text1: "10,000+", text2: "전문 강의" },
        {iconSrc: "/image/instructor1.png", altText: "강사아이콘", text1: "1,000+", text2: "전문 강사" },
        {iconSrc: "/image/satisfaction1.png", altText: "만족도아이콘", text1: "95%", text2: "수강생 만족도" },
    ]

return(

        <div>
            <div className='cardSection'>
                <div className='cardSectionContent'>

                    
                    <div className='cardImage'>
                        <div className='hotIcon'>
                            <img src="/image/fire-icon.png" />
                            인기강의
                        </div>
                        <div className='ggimIcon'>
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
                    <div className='cardText'>
                        <button className='textButton'>수강 신청</button>
                    </div> 
                </div>
            </div>

            <div className='categorie-border-wrap'>
                <div className='categorie-inner'>
                    {categories.map((cat) => (
                        <div 
                            className={`category-item ${activeCategory === cat.name ? 'selected' : ''}`}
                            onClick={() => handleCategoryClick(cat.name)}
                            key={cat.name}
                        >
                            {cat.icon && <img src={cat.icon} alt={cat.name} />}
                            {cat.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className='mainCourseArea-border'>
                <div className='mainCourseArea-inner' onClick={handlecourseClick}>
                    <div className='courseTitle'>
                        <div className='course-one'>인기강의</div>
                        <div className='course-two'>6개의 강의</div>             
                    </div>
                    <div className='courseContent'>
                        <div className='courseContent-detail'>
                            <div className='courseImage'></div>
                            <div className='courseDetail'></div>
                        </div>    
                    </div>
                </div>
            </div>

            <div className='adArea-border'>
                <div className='adArea-inner'>
                    <div className='adAreaTitle'>신뢰받는 학습 플랫폼</div>
                    <div className='adAreaSubTitle'>수많은 학습자들이 E-Learming과 함께 성장하고 있습니다</div>
                    <div className='adAreaContent-border'>
                        {adContents.map((content, index) => (
                            <div className='adAreaContent-inner' key={index}>
                                <div className='adAreaIcon'>
                                    <img src={content.iconSrc} alt={content.altText} />
                                </div>
                                <div className='adAreaText1'>
                                    {content.text1}
                                </div>
                                <div className='adAreaText2'>
                                    {content.text2}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
        
    );
}
export default Main;