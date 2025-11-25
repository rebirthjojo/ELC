import './Main.css'

const Main = ()=>{
return(

        <div>
            <div className='cardSection'>
                <div className='cardSectionContent'>
                    <div className='cardImage'>
                        <div className='hotIcon'>
                            <div><img src="/image/fire-icon.png"></img></div>
                            <span>인기강의</span>
                        </div>
                        <div className='ggimIcon'>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="17.5" fill="#F0F0F0" stroke="#E0E0E0"/>
                            {/* 하트 path에 클래스 추가 */}
                            <path 
                                className="heart-path" /* 이 클래스를 통해 하트를 선택 */
                                d="M18 12.5C14.75 8.75 9 10.35 9 15.5C9 20.65 14.2 24.5 18 27C21.8 
                                24.5 27 20.65 27 15.5C27 10.35 21.25 8.75 18 12.5Z" 
                                fill="none" /* 초기 상태는 비어있음 */
                                stroke="#6C757D" 
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        </div>
                    </div>
                    <div className='cardText'>
                        <div className='textDetail'></div>
                        <button className='textButton'>수강 신청</button>
                    </div> 
                </div>
            </div>

            <div className='kategorie'>
                <div className='entire'></div>
                <div className='development'></div>
                <div className='design'></div>
                <div className='business'></div>
                <div className='marketing'></div>
                <div className='picture'></div>
                <div className='music'></div>
            </div>

            <div className='mainCourseArea'>
                <div className='courseTitle'>인기강의</div>
                <div className='courseContent'>
                    <div className='courseImage'></div>
                    <div className='courseDetail'></div>
                </div>
            </div>

            <div className='adArea'>
                <div className='adAreaTitle'>신뢰받는 학습 플랫폼</div>
                <div className='adAreaSubTitle'>수많은 학습자들이 E-Learming과 함께 성장하고 있습니다</div>
                <div className='adAreaContent'>
                    <div className='adAreaIcon'></div>
                    <div className='adAreaText1'>500,000+</div>
                    <div className='adAreaText2'>활동 중인 수강생</div>
                </div>
            </div>
            
        </div>
        
    );
}
export default Main;