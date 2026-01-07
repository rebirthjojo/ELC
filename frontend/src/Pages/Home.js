import './Home.css';
function Home() {
    return (
        <div className="home-container">
            {/* 히어로 섹션: 로고와 설명 */}
            <header className="hero-section">
                <img src="/image/logo_large.png" alt="EC Logo" className="main-logo-big" />
                <h1 className="main-headline">누구나 쉽게 배우는 실무 프로그래밍</h1>
                <p className="main-description">
                    현업 전문가들의 노하우가 담긴 강의를 통해<br/>
                    여러분의 꿈을 현실로 만들어보세요.
                </p>
                <button className="start-btn">무료로 시작하기</button>
            </header>

            {/* 기존에 만드신 인기 강의 리스트를 아래에 배치 */}
            <section className="popular-courses-section">
                <h2>실시간 인기 강의 🔥</h2>
                {/* 여기에 기존 강의 카드 리스트 컴포넌트 삽입 */}
            </section>
        </div>
    );
}

export default Home;