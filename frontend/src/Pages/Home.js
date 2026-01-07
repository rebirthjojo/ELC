import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();

    const handleGoToLectures = () => {
        navigate('/Main');
    };

    return (
        <div className="home-container">
            <header className="hero-section">
                <img className="main-logo-big" src="/image/ELC1.svg" alt="EC Logo" />
                <h1 className="main-headline">누구나 쉽게 배우는 실무 프로그래밍</h1>
                <p className="main-description">
                    현업 전문가들의 노하우가 담긴 강의를 통해<br/>
                    여러분의 꿈을 현실로 만들어보세요.
                </p>
                <button className="start-btn" onClick={handleGoToLectures}>강의 구경하기</button>
            </header>
        </div>
    );
}
export default Home;