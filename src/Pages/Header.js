import "./Header.css"
import { useNavigate } from "react-router-dom";

const Header = () => {

const navigate = useNavigate();  
const handleClick = () =>{
        navigate ("/");
}
const handleClick2 = () =>{
    navigate ("/course");
}
const handleClick3 = () =>{
    navigate ("/mycourse");
}

return(
    <div id="HerderPart">
        <div className="NaviBar">
            <div className="Logo" onClick={handleClick}>ELC</div>
            <div className="home" onClick={handleClick}>홈</div>
            <div className="course" onClick={handleClick2}>강의</div>
            <div className="mycourse" onClick={handleClick3}>내학습</div>
        </div>
        <div className="searchbar" />
        <div className="personalarea">
            <div className="ggimList">찜목록</div>
            <div className="alarmList">알림</div>
            <div className="loginbutton">로그인</div>
        </div>
    </div>
)
}
export default Header;