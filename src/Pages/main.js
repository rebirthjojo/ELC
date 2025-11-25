import './Main.css'

const Main = ()=>{
return(

        <div>
            <div className='cardSection'>
                <div className='cardImage'>
                    <div className='hotIcon'></div>
                    <div className='ggimIcon'></div>
                </div>
                <div className='cardText'></div> 
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