import './Main.css'
import { useNavigate } from "react-router-dom";

const Main = ()=>{

    const navigate = useNavigate();

    const handlecourseClick = () =>{
        navigate ("/Detail");
}
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
                    <div className='entire'>전체</div>
                    <div className='development'>
                        <img src="/image/entire1.png" />
                        개발
                    </div>
                    <div className='design'>
                        <img src="/image/design1.png" />
                        디자인
                    </div>
                    <div className='business'>
                        <img src="/image/business1.png" />
                        비지니스
                    </div>
                    <div className='marketing'>
                        <img src="/image/marketing1.png" />
                        마케팅
                    </div>
                    <div className='picture'>
                        <img src="/image/picture1.png" />
                        사진
                    </div>
                    <div className='music'>
                        <img src="/image/music1.png" />
                        음악
                    </div>
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
                        <div className='adAreaContent-inner'>
                            <div className='adAreaIcon'>
                                <img src="/image/sutdent.png" />
                            </div>
                            <div className='adAreaText1'>500,000+</div>
                            <div className='adAreaText2'>활동 중인 수강생</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    );
}
export default Main;