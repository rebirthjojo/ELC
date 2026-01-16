import { useState } from "react";
import "./Header.css"
import { useNavigate } from "react-router-dom";
import {AdmPage, PersonalinfoPage, Tapmodalbase} from "./Tapmodalbase";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const COURSE_API_URL = process.env.REACT_APP_COURSE_API_URL || 'http://localhost:8082/api';

const Header = () => {

const { isSignIn, user, signout} = useAuth();

const [searchTerm, setSearchTerm] = useState("");

const PersonalAreaContent = () => {
    const isTutor = user && user.tutor === 'y';
    const LoginLogoutButton = () => (
        <div className="loginArea">
            {isSignIn ? (
                <button className="loginbutton" onClick={handleSignout}>
                    로그아웃
                </button>
            ) : (
                <button className="loginbutton" onClick={handleClick6}>
                    로그인
                </button>
            )}
        </div>
    );

    if (isTutor){
        return(
            <div className="personalarea">
                <div className="regisrerLink" onClick={openAdm}>강의 등록</div>
                <div className="personalinfo" onClick={openPersonalInfo}>정보 수정</div>
                <LoginLogoutButton />
            </div>
        );
    }else{
        return(
            <div className="personalarea">
                <div className="ggimList"><img alt='찜목록 아이콘' src="/image/heart.svg" onClick={handleClick4}/></div>
                <div className="alarmList"><img alt='알림 아이콘' src="/image/ararm.svg"/></div>
                {isSignIn &&(
                <div className="personalinfo" onClick={openPersonalInfo}>정보 수정</div>
                )
                }
                <LoginLogoutButton />
            </div>
        );
    }
};
const navigate = useNavigate();  
const [isTapOpen, setIsTapOpen] = useState(false);
const [isAdmOpen, setIsAdmOpen] = useState(false);
const [ispersonalInfoOpen, setIspersonalInfoOpen] = useState(false);
const handleClick = () =>{
        navigate ("/");
};
const openPersonalInfo = () => {
    setIspersonalInfoOpen(true);
};
const openAdm = () => {
    setIsAdmOpen(true);
};
const handleClick2 = () =>{
    navigate ("/Main");
};
const handleClick3 = () =>{
    navigate ("/mycourse");
};
const handleClick4 = () =>{
    navigate ("/Wishlist");
};
const handleClick6 =() =>{
    setIsTapOpen(true);
};
const closeTap = () => {
    setIsTapOpen(false);
};
const closeAdm = () => {
    setIsAdmOpen(false);
};
const closePersonalInfo = () => {
    setIspersonalInfoOpen(false);
};
const handleSignout = () => {
    signout();
    closeTap();
};

const handleSearch = async () => {
    console.log("--- handleSearch 함수 시작 ---");

    if (!searchTerm.trim()) {
        alert("검색어를 입력해주세요.");
        return;
    }

    try {
        const response = await axios.get(`${COURSE_API_URL}/search`, {
            params: {
                keyword: searchTerm.trim()
            }
        });

        console.log("검색 결과:", response.data);
        
        navigate(`/search?q=${searchTerm.trim()}`,{
            state: {searchResults: response.data}
        });
        setSearchTerm("");

    } catch (error) {
        console.error("검색 요청 오류:", error);
        alert("검색 중 오류가 발생했습니다.");
    }
};

return(
    <div id="HerderPart-outer">
        <div className="HerderPart-inner">
        <div className="NaviBar">
            <div className="Logo" onClick={handleClick}><img alt='타이틀 아이콘' src="/image/ELC.svg" /></div>
            <div className="home" onClick={handleClick}>홈</div>
            <div className="course" onClick={handleClick2}>강의</div>
            <div className="mycourse" onClick={handleClick3}>내학습</div>
        </div>
        <div className="searchbar">
            <button id="searchbutton" onClick={handleSearch}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1"/> 
                    <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
            </button>
            <input type="text" id="searchinput" placeholder="검색어를 입력하세요"
                    value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}        
            ></input>
        </div>
        <PersonalAreaContent />
        {isTapOpen && (
            <div className="overlay" onClick={closeTap}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <Tapmodalbase onClose={closeTap}/>
            </div>
            </div>
        )}
        {isAdmOpen && (
            <div className="overlay" onClick={closeAdm}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <AdmPage onClose={closeAdm}/>
            </div>
            </div>
        )}
        {ispersonalInfoOpen && (
            <div className="overlay" onClick={closePersonalInfo}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <PersonalinfoPage onClose={closePersonalInfo}/>
            </div>
            </div>
        )}
        </div>
    </div>
)
}
export default Header;