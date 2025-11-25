import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Headers = () => {

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
            <div className="Logo" content="ELC" onClick={handleClick} />
            <div className="home" content="홈" onClick={handleClick} />
            <div className="course" content="강의" onClick={handleClick2} />
            <div className="mycourse" content="내학습" onClick={handleClick3} />
        </div>
        <div className="">
            <div className="ggimIcon"></div>
            <div className=""></div>
            <div className="loginbutton" content="로그인" onClick={} />
        </div>
    </div>
)
}
export default Headers;