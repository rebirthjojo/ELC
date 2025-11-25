import './main.css'

function main(){
    return(
        <>
        <Header />

        <Main>
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
                <div className='courseDetail'>
                    <div className=''></div>
                </div>

            </div>
        </Main>
        
        <Footer />
        </>
    );
}

export default main;