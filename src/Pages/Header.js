import { useState } from "react";
import "./Header.css"
import { useNavigate } from "react-router-dom";
import {Tapmodalbase} from "./Tapmodalbase";
import {AdmPage} from "./Tapmodalbase";

const Header = () => {

const navigate = useNavigate();  
const [isTapOpen, setIsTapOpen] = useState(false);
const handleClick = () =>{
        navigate ("/");
}
const handleClick2 = () =>{
    navigate ("/AdmPage");
}
const handleClick3 = () =>{
    navigate ("/mycourse");
}

const handleClick6 =() =>{
    setIsTapOpen(true);
}

const closeTap = () => {
    setIsTapOpen(false);
}

return(
    <div id="HerderPart">
        <div className="NaviBar">
            <div className="Logo" onClick={handleClick}><img alt='타이틀 아이콘' src="/image/ELC.svg" /></div>
            <div className="home" onClick={handleClick}>홈</div>
            <div className="course" onClick={handleClick2}>강의</div>
            <div className="mycourse" onClick={handleClick3}>내학습</div>
        </div>
        <div className="searchbar">
            <button id="searchbutton">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1"/> 
                    <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                </svg>
            </button>
            <input type="text" id="searchinput" placeholder="검색어를 입력하세요"></input>
        </div>
        <div className="personalarea">
            <div className="ggimList"><img alt='찜목록 아이콘' src="/image/heart.svg"/></div>
            <div className="alarmList"><img alt='알림 아이콘' src="/image/ararm.svg"/></div>
            <button className="loginbutton" onClick={handleClick6}>로그인</button>
        </div>
        {isTapOpen && (
            <div className="overlay" onClick={closeTap}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <Tapmodalbase onClose={closeTap}/>
            </div>
            </div>
        )}
    </div>
)
}
export default Header;