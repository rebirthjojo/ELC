import { useCallback, useEffect, useRef, useState } from 'react';
import "./Tapmodalbase.css";
import axios from 'axios';

export function Tapmodalbase({onClose}){
    const [onTap, setOnTap] =useState('left');

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [agreeterm, setAgreeterm] = useState(false)
    const [receiveMarketing, setreceiveMarketing] = useState(false)
    const DEFAULT_TUTOR_STATUS = 'n';
    
    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handlePhoneChange = (event) => {
        let value = event.target.value;
        
        const cleanedValue = value.replace(/[^0-9]/g, '');
        let formattedValue = '';
        
        if (cleanedValue.length < 4){
            formattedValue = cleanedValue;
        }else if (cleanedValue.length < 8){
            formattedValue = cleanedValue.substring(0, 3) + '-' + cleanedValue.substring(3);            
        }else if (cleanedValue.length <= 11){
            formattedValue = cleanedValue.substring(0, 3) + '-' + cleanedValue.substring(3, 7) + '-' + cleanedValue.substring(7);
        }else{
        formattedValue = cleanedValue.substring(0, 11);
        formattedValue = formattedValue.substring(0, 3) + '-' +formattedValue.substring(3, 7) + '-' + formattedValue.substring(7);
    }
    setPhone(formattedValue);
};

    const handleTermsChange = (e) => {setAgreeterm(e.target.checked);};
    const handleMarketingChange = (e) => {setreceiveMarketing(e.target.checked);};

    const modalRef = useRef(null);
    const initalFocusRef = useRef(null);
    const activeClass = 'active';
    const handleTapClick = (tapname) =>{
        setOnTap(tapname);
        }

    const handleSignInSubmit = async () => {
        const signIndata = {
            email : email,
            password : password
        };
        try{
            const response = await axios.post('/signIn', signIndata);
            console.log("로그인 성공", response.data);
            if (onClose){
            onClose();
            }
        } catch (error){
            console.error("로그인 실패: ", error);
        }
    };

    const handleSignupSubmit = async () => {
        const cleanedPhoneNumber = phone.replace(/-/g, '');
        const signUpData = {
            name: name,
            email: email,
            password: password,
            phoneNumber: cleanedPhoneNumber,
            agreeTerms: agreeterm,
            receiveMarketing: receiveMarketing,
            tutor: DEFAULT_TUTOR_STATUS
        };
        try{
            console.log("보내는 데이터:", signUpData);
            const response = await axios.post('/signUp', signUpData);
            console.log("회원가입 성공", response.data);
            if(onClose){
                onClose();
            }
        }catch (error){
            console.error("회원가입 실패: ", error);
        }
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Escape"){
            if (onClose){
            onClose();
        }
        }else if (event.key === "Tab" && modalRef.current){
            const focusableElements = modalRef.current.querySelectorAll(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length -1];

            if (event.shiftKey){
                if(document.activeElement === firstElement){
                    lastElement.focus();
                    event.preventDefault();
                }
            }else{
                if (document.activeElement === lastElement){
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    },[onClose]);

    useEffect(()=>{
        if (modalRef.current){
            document.addEventListener('keydown', handleKeyDown);

            if (initalFocusRef.current){
                initalFocusRef.current.focus();
            }
        }
        return() => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    },[handleKeyDown]);

    useEffect(() => {
        const handleClickOutside = (event) =>{
            if (modalRef.current && !modalRef.current.contains(event.target)){
                event.preventDefault();
                event.stopPropagation();

                if (initalFocusRef.current){
                    initalFocusRef.current.focus();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [initalFocusRef]);

return(
    <div id='tap-wrapper' role='dialog' aria-modal="true" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <div className='Always-area'><img alt='타이틀 아이콘' className="title-image" src="/image/ELC.svg" />
            <span className='catchphrase'>학습의 즐거움을 경험하세요</span>
                <div className='buttonArea'>
                    <button className={`tap-button ${onTap === "left" ? activeClass:''}`}
                    onClick={()=>handleTapClick("left")} ref={onTap === 'left' ? initalFocusRef : null}>로그인</button>
                    <button className={`tap-button ${onTap === "right" ? activeClass:''}`}
                    onClick={()=>handleTapClick("right")} ref={onTap === 'right' ? initalFocusRef : null}>회원가입</button>
                </div>
            </div>
        <div>
            {onTap === "left"&&(
                <div className='signinArea'>                    
                    <span className='email'>이메일</span>
                    <img src='/image/e-mail.svg' alt='이메일 아이콘' className='email-icon' width="24" height="24" />
                    <input type='text' className='sign-email' placeholder='이메일을 입력하세요' value={email} onChange={handleEmailChange}/>
                    <span className='password'>비밀번호</span>
                    <img src='/image/lock.svg' alt='비밀번호 아이콘' className='lock-icon' width="24" height="24" />
                    <input type='password' className='sign-password' placeholder='비밀번호를 입력하세요' value={password} onChange={handlePasswordChange}/> 
                    <input type='checkbox' className='sign-checkbox'/>
                    <span className='text'>로그인 상태 유지</span> 
                    <span className='search-pass'>비밀번호 찾기</span>
                    <button className='signin-button' onClick={handleSignInSubmit}>로그인</button>
                </div>
            )}
            {onTap === "right"&&(
                <div className='signupArea'>
                    <span className='upName'>이름</span>
                    <img src='/image/person.svg' alt='사람 아이콘' className='person-icon' width="24" height="24" />
                    <input type='text' className='up-name' placeholder='이름을 입력하세요' value={name} onChange={handleNameChange}/>
                    <span className='upEmail'>이메일</span>
                    <img src='/image/e-mail.svg' alt='이메일 아이콘' className='email-icon' width="24" height="24" />
                    <input type='text' className='up-email' placeholder='이메일을 입력하세요' value={email} onChange={handleEmailChange}/>
                    <span className='upPass'>비밀번호</span>
                    <img src='/image/lock.svg' alt='비밀번호 아이콘' className='lock-icon' width="24" height="24" />
                    <input type='password' className='up-pass' placeholder='비밀번호를 입력하세요' value={password} onChange={handlePasswordChange}/>
                    <span className='upNumber'>전화번호</span>
                    <img src='/image/phone.svg' alt='전화기 아이콘' className='phone-icon' width="24" height="24" />
                    <input type='tel' className='up-number' placeholder='010-0000-0000' value={phone} onChange={handlePhoneChange}/>
                    <input type='checkbox' className='first-check' checked={agreeterm} onChange={handleTermsChange} />
                    <span className='text-1'>이용약관 및 개인정보처리방침에 동의합니다.</span>
                    <input type='checkbox' className='second-check' checked={receiveMarketing} onChange={handleMarketingChange} />
                    <span className='text-2'>마케팅 정보 수신에 동의합니다.(선택)</span>
                    <button className='signup-button' onClick={handleSignupSubmit}>회원가입</button>
                </div>
            )}
        </div>
    </div>
);
}

export function AdmPage({onClose}){
    const [onTap, setOnTap] =useState('left');
    const DEFAULT_TUTOR_STATUS = 'y';

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [tutorinfo, setTutorinfo] = useState('')

    const [courseName, setCourseName] = useState('')
    const [courseline, setCourseline] = useState('')
    const [subcoursename, setsubcoursename] = useState('')
    const [imagename, setImagename] = useState('')
    const [videourl, setvideourl] = useState('')
    const [courseprice, setCourseprice] = useState('')    
    
    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handlePhoneChange = (e) => setPhone(e.target.value);
    const handletutorinfoChange = (e) => setTutorinfo(e.target.value);    

    const handlecourseNameChange = (e) => setCourseName(e.target.value);
    const handlecourselineChange = (e) => setCourseline(e.target.value);
    const handlesubcoursenameChange = (e) => setsubcoursename(e.target.value);
    const handleimagenameChange = (e) => setImagename(e.target.value);
    const handlevideourlChange = (e) => setvideourl(e.target.value);
    const handlecoursepriceChange = (e) => setCourseprice(e.target.value);

    const modalRef = useRef(null);
    const initalFocusRef = useRef(null);
    const activeClass = 'active';
    const handleTapClick = (tapname) =>{
        setOnTap(tapname);
        }
    
    const handleSignupSubmit = async () => {
        const signUpData = {
            name: name,
            email: email,
            password: password,
            phoneNumber: phone,
            tutor: DEFAULT_TUTOR_STATUS,
            tutorinfo: tutorinfo
        };
        try{
            const response = await axios.post('/signUp', signUpData);
            console.log("회원가입 성공", response.data);
            if(onClose){
                onClose();
            }
        }catch (error){
            console.error("회원가입 실패: ", error);
        }
    };

    const handlecourseSubmit = async () => {
        const courseRegData = {
            courseName: courseName,
            courseline: courseline,
            subcoursename: subcoursename,
            imagename: imagename,
            videourl: videourl,
            tutor: DEFAULT_TUTOR_STATUS,
            tutorinfo: tutorinfo,
            courseprice: courseprice
        };
        try{
            const response = await axios.post('/course', courseRegData);
            console.log("강의등록 성공", response.data);
            if(onClose){
                onClose();
            }
        }catch (error){
            console.error("강의등록 실패: ", error);
        }
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Escape"){
            if (onClose){
            onClose();
        }
        }else if (event.key === "Tab" && modalRef.current){
            const focusableElements = modalRef.current.querySelectorAll(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length -1];

            if (event.shiftKey){
                if(document.activeElement === firstElement){
                    lastElement.focus();
                    event.preventDefault();
                }
            }else{
                if (document.activeElement === lastElement){
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    },[onClose]);

    useEffect(()=>{
        if (modalRef.current){
            document.addEventListener('keydown', handleKeyDown);

            if (initalFocusRef.current){
                initalFocusRef.current.focus();
            }
        }
        return() => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    },[handleKeyDown]);

    useEffect(() => {
        const handleClickOutside = (event) =>{
            if (modalRef.current && !modalRef.current.contains(event.target)){
                
                event.preventDefault();
                event.stopPropagation();
                if (initalFocusRef.current){
                    initalFocusRef.current.focus();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [initalFocusRef]);

return(
    <div id='adm-wrapper' role='dialog' aria-modal="true" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <div className='adm-Always-area'><img alt='타이틀 아이콘' className="title-image" src="/image/ELC.svg" />
            <div className='adm-buttonArea'>
                    <button className={`tap-button ${onTap === "left" ? activeClass:''}`}
                    onClick={()=>handleTapClick("left")} ref={onTap === 'left' ? initalFocusRef : null}>강사등록</button>
                    <button className={`tap-button ${onTap === "right" ? activeClass:''}`}
                    onClick={()=>handleTapClick("right")} ref={onTap === 'right' ? initalFocusRef : null}>강의등록</button>
                </div>
            </div>
        <div>
            {onTap === "left"&&(
                <div className='tutorregArea'>                    
                    <span className='tuname'>이름</span>
                    <img src='/image/person.svg' alt='사람 아이콘' className='person-icon' width="24" height="24" />
                    <input type='text' className='up-name' placeholder='이름을 입력하세요' value={name} onChange={handleNameChange}/>
                    <span className='tuEmail'>이메일</span>
                    <img src='/image/e-mail.svg' alt='이메일 아이콘' className='email-icon' width="24" height="24" />
                    <input type='text' className='sign-email' placeholder='이메일을 입력하세요' value={email} onChange={handleEmailChange}/>
                    <span className='tuPass'>비밀번호</span>
                    <img src='/image/lock.svg' alt='비밀번호 아이콘' className='lock-icon' width="24" height="24" />
                    <input type='password' className='sign-pass' placeholder='비밀번호를 입력하세요' value={password} onChange={handlePasswordChange}/>
                    <span className='tuNumber'>전화번호</span>
                    <img src='/image/phone.svg' alt='전화기 아이콘' className='phone-icon' width="24" height="24" />
                    <input type='tel' className='up-number' placeholder='010-0000-0000' value={phone} onChange={handlePhoneChange}/>
                    <span className='tuCareer'>경력사항</span>
                    <img src='/image/career.svg' alt='경력 아이콘' className='career-icon' width="24" height="24" />
                    <textarea className='career-info' placeholder='단순하게 기재해 주세요' value={tutorinfo} onChange={handletutorinfoChange}/>
                    <button className='tutor-reg-button' onClick={handleSignupSubmit}>강사 등록</button>
                </div>
            )}
            {onTap === "right"&&(
                <div className='courseregArea'>
                    <span className='courseName'>과목명</span>
                    <input type='text' className='course-name' placeholder='과목명을 입력하세요' value={courseName} onChange={handlecourseNameChange}/>
                    <label className='courseCat'>계열</label>
                    <select className='course-select' value={courseline} onChange={handlecourselineChange}>
                        <option value="" disabled selected>계열을 선택하세요</option>
                        <option value={"develop"}>개발</option>
                        <option value={"design"}>디자인</option>
                        <option value={"business"}>비지니스</option>
                        <option value={"macketing"}>마케팅</option>
                        <option value={"photo"}>사진</option>
                        <option value={"music"}>음악</option>
                    </select>
                    <div className='subcourseaddArea'>
                        <span className='subcoursename'>세부 강의명</span>
                        <input type='file' className='sub-cou-name' placeholder='상세 강의 명을 입력하세요' value={subcoursename} onChange={handlesubcoursenameChange}/>
                        <span className='videourl'>이미지 등록</span>
                        <input type='text' className='image-name' placeholder='이미지를 등록해 주세요' value={imagename} onChange={handleimagenameChange}/>
                        <span className='videourl'>동영상 주소</span>
                        <input type='text' className='video-url' placeholder='동영상 주소를 넣어주세요' value={videourl} onChange={handlevideourlChange}/>
                    </div>
                    <span className='courseName'>과목명</span>
                    <input type='number' className='course-price' placeholder='강좌 가격을 입력해 주세요' value={courseprice} onChange={handlecoursepriceChange}/>
                    <button className='course-reg-button' onClick={handlecourseSubmit}>강의 등록</button>
                </div>
                
            )}
        </div>
    </div>

    );
}