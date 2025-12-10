import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import "./Tapmodalbase.css";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export function Tapmodalbase({onClose}){
    const [onTap, setOnTap] =useState('left');

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [agreeterm, setAgreeterm] = useState(false)
    const [receiveMarketing, setreceiveMarketing] = useState(false)
    const DEFAULT_TUTOR_STATUS = 'n';

    const {setToken, setUser} = useAuth();
    
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
        const requestURL = '/sign/signIn';
        try{
            const response = await axios.post('/sign/signIn', signIndata);
            const { accessToken, refreshToken } = response.data;
            if (accessToken){
                setToken(accessToken);
                try{
                    const decoded = jwtDecode(accessToken);
                    const userData = {
                        email: decoded.sub,
                        tutor: decoded.tutor,
                    };
                    setUser(userData);
                }catch (decodeError){
                    console.error("JWT 디코딩 실패", decodeError);
                }
            }
            if (refreshToken){
                localStorage.setItem('refreshToken', refreshToken);
            }
            
            console.log("로그인 성공", response.data);
            
            if (onClose){
            onClose();
            }
        } catch (error){
            console.error("로그인 실패: ", error);
        }
    };

    const handleSignupSubmit = async () => {
        if (!agreeterm){
            console.error("이용약관 및 개인정보처리방침에 동의해야 합니다.");
            alert("필수 약관에 동의해 주세요.");
            return;
        }
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
            const response = await axios.post('/sign/signUp', signUpData);
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

    useEffect(() => {
        document.body.classList.add('modal-open');
        return() => {
            document.body.classList.remove('modal-open');
        };
    },[]);

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
                    <button className='signup-button' onClick={handleSignupSubmit} disabled={!agreeterm}>회원가입</button>
                </div>
            )}
        </div>
    </div>
);
}

export function AdmPage({ onClose }) {
    
    const [courseName, setCourseName] = useState('');
    const [courseline, setCourseline] = useState('');
    const [subcoursename, setsubcoursename] = useState(''); 
    const [imagename, setImagename] = useState('');
    const [videourl, setvideourl] = useState('');
    const [courseprice, setCourseprice] = useState('');

    const handlecourseNameChange = (e) => setCourseName(e.target.value);
    const handlecourselineChange = (e) => setCourseline(e.target.value);
    const handlesubcoursenameChange = (e) => setsubcoursename(e.target.value);
    const handleimagenameChange = (e) => setImagename(e.target.value);
    const handlevideourlChange = (e) => setvideourl(e.target.value);
    const handlecoursepriceChange = (e) => setCourseprice(e.target.value);

    const modalRef = useRef(null);
    const initalFocusRef = useRef(null);

    const handlecourseSubmit = async () => {
        if (!courseName || !courseline || !courseprice) {
            alert('과목명, 계열, 가격은 필수 입력 항목입니다.');
            return;
        }

        const courseRegData = {
            courseName: courseName,
            courseline: courseline,
            subcoursename: subcoursename,
            imagename: imagename,
            videourl: videourl,
            courseprice: courseprice,
        };
        
        try {
            console.log("보내는 강의 등록 데이터:", courseRegData);
            const response = await axios.post('/course', courseRegData);
            console.log("강의등록 성공", response.data);
            alert('강의가 성공적으로 등록되었습니다.');
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("강의등록 실패: ", error);
            alert(`강의 등록 실패: ${error.message}`);
        }
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Escape") {
            if (onClose) {
                onClose();
            }
        } else if (event.key === "Tab" && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (modalRef.current) {
            document.addEventListener('keydown', handleKeyDown);
            
            if (initalFocusRef.current) {
                initalFocusRef.current.focus();
            }
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                if (initalFocusRef.current) {
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
    }, []);
    
    useEffect(() => {
        document.body.classList.add('modal-open');
        return() => {
            document.body.classList.remove('modal-open');
        };
    },[]);

    return (
        <div id='adm-wrapper' role='dialog' aria-modal="true" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
            <div className='adm-Always-area'>
                <img alt='타이틀 아이콘' className="title-image" src="/image/ELC.svg" />
                <h2 className='adm-title'>강의 등록</h2> 
            </div>
            
            <div className='courseregArea'>
                <span className='courseName'>과목명</span>
                <input 
                    type='text' 
                    className='course-name' 
                    placeholder='과목명을 입력하세요' 
                    value={courseName} 
                    onChange={handlecourseNameChange} 
                    ref={initalFocusRef}
                /> 
                
                <label className='courseCat'>계열</label>
                <select className='course-select' value={courseline} onChange={handlecourselineChange}>
                    <option value="" disabled>계열을 선택하세요</option>
                    <option value={"develop"}>개발</option>
                    <option value={"design"}>디자인</option>
                    <option value={"business"}>비지니스</option>
                    <option value={"macketing"}>마케팅</option>
                    <option value={"photo"}>사진</option>
                    <option value={"music"}>음악</option>
                </select>
                
                <div className='subcourseaddArea'>
                    <span className='subcoursename'>세부 강의명</span>
                    <input type='text' className='sub-cou-name' placeholder='상세 강의 명을 입력하세요' value={subcoursename} onChange={handlesubcoursenameChange}/> 
                    
                    <span className='image-url'>이미지 파일/URL</span>
                     <input type='text' className='image-name' placeholder='이미지 파일명 또는 URL을 입력해 주세요' value={imagename} onChange={handleimagenameChange}/>
                    
                    <span className='videourl'>동영상 주소</span>
                    <input type='text' className='video-url' placeholder='동영상 주소를 등록해주세요' value={videourl} onChange={handlevideourlChange}/>
                </div>
                
                <span className='courseprice'>강좌 가격</span>
                <input type='number' className='course-price' placeholder='강좌 가격을 입력해 주세요' value={courseprice} onChange={handlecoursepriceChange}/>
                
                <button className='course-reg-button' onClick={handlecourseSubmit}>강의 등록</button>
            </div>
        </div>
    );
}

export function PersonalinfoPage({ onClose }) {

    const BASE_URL = '/sign';

    const getAuthConfig = (token) => ({
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        },
    });

    const fetchProfile = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/profile`, getAuthConfig(token));
        return response.data;
    } catch (error) {
        throw error;
    }
    };

    const updateProfile = async (token, uid, updateData) => {
        try {
        const response = await axios.put(`${BASE_URL}/users/${uid}`, updateData, getAuthConfig(token));
        return response.data;
        } catch (error) {
        throw error;
        }
        };


    const softDeleteUser = async (token, uid) => {
        try {
        await axios.delete(`${BASE_URL}/users/${uid}`, getAuthConfig(token));
        } catch (error) {
        throw error;
        }
    };
    
    const { user, token, signout, setUser } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [tutorDetail, setTutorDetail] = useState('');
    
    const [currentPassword, setCurrentPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState('');

    const isTutor = user && user.tutor === 'y';
    const userUid = user?.uid;

    const handlephoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handletutorDetailChange = (e) => setTutorDetail(e.target.value);
    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

    useEffect(() => {
        if (!token || !userUid){
            setIsLoading(false);
            return;
        }

        const loadProfile = async () => {
            try {
                const data = await fetchProfile(token); 

                setName(data.name || '');
                setEmail(data.email || '');
                setPhoneNumber(data.phoneNumber || '');
                if (isTutor){
                    setTutorDetail(data.tutorDetail || '');
                }
            }catch (error){
                console.error("프로필 로드 실패 : ", error);
                alert("사용자 정보를 불러오는데 실패 했습니다.");
                signout();
            }finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [token, userUid, isTutor, signout]);

    const handleInfoUpdate = async () => {
        if (!userUid || !token) return alert("로그인 정보가 유효하지 않습니다.");

        const infoUpdateData = {
            phoneNumber: phoneNumber,
            ...(isTutor && { tutorDetail: tutorDetail})
        };

        try {
            await updateProfile(token, userUid, infoUpdateData);
            alert("정보가 성공적으로 수정되었습니다.");
        } catch (error){
            console.error("정보 수정 실패:", error);
            alert(`정보 수정 실패: ${error.response?.data?.message || '서버오류'}`);
        }
    };
        const handlePasswordUpdate = async () => {
        if (!userUid || !token) return alert("로그인 정보가 유효하지 않습니다.");
        if (!currentPassword || !newPassword) return alert("현재 비밀 번호 및 변경할 비밀 번호를 모두 작성하셔야 합니다.");

        const passwordUpdateData = {
            currentPassword : currentPassword,
            newPassword : newPassword
        };
        try {
            await updateProfile(token, userUid, passwordUpdateData);
            alert("비밀 번호가 성공적으로 변경되었습니다. 보안을 위해 다시 로그인해 주세요.");
            signout();
            onClose();
        }catch (error) {
            console.error("비밀번호 변경 실패: ", error);
            alert(`비밀번호 변경 실패: ${error.response?.data?.message || '서버 오류'}`);
        }
    };

    const handleAccountDelete = async () => {
        if (!userUid || !token) return;

        if (!window.confirm("정말로 계정을 비활성화(삭제) 하시겠습니까? 이 작업은 되돌릴 수 없습니다.")){
            return;
        }

        try {
            await softDeleteUser(token, userUid);
            alert("계정이 성공적으로 비활성화되었습니다.");
            signout();
            onClose();
        } catch (error) {
            console.error("계정 삭제 실패:", error);
            alert(`계정 삭제 실패: ${error.response?.data?.message || '서버 오류'}`);
        }
    };
    
    const modalRef = useRef(null);
    const initalFocusRef = useRef(null);

    if (isLoading) {
        return(
            <div id='info-wrapper' className='loading-modal' ref={modalRef} tabIndex={-1} />
        );
    }

    return (
        <div id='info-wrapper' role='dialog' aria-modal="true" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
            <div className='info-Always-area'>
                <img alt='타이틀 아이콘' className="title-image" src="/image/ELC.svg" />
                <h2 className='info-title'>프로필 정보 수정</h2> 
            </div>
            
            <div className='infomodifyArea'>
                <span className='info-label'>이름</span>
                <input type='text' className='info-readonly' value={name} readOnly disabled />
                <span className='info-label'>이메일</span>
                <input type='text' className='info-readonly' value={email} readOnly disabled />
                
                <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }}/>
                
                <span className='info-label'>전화번호</span>
                <input 
                    type='tel'
                    className='info-input'
                    value={phoneNumber}
                    onChange={handlephoneNumberChange}
                    ref={initalFocusRef}
                    placeholder='010-0000-0000'
                    />
                {isTutor &&(
                    <div className='tutor-detail-area'>
                        <span className='info-label'>상세 설명</span>
                        <textarea 
                            className='info-textarea'
                            value={tutorDetail}
                            onChange={handletutorDetailChange}
                            placeholder='설명을 입력하세요'
                            />
                            </div>
                )}
                <button className='update-button' onClick={handleInfoUpdate}>정보 수정</button>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }}/>
                <span className='info-label'>현재 비밀번호</span>
                <input type='password' className='info-input' value={currentPassword} onChange={handleCurrentPasswordChange}/>
                <span className='info-label'>새 비밀번호</span>
                <input type='password' className='info-input' value={newPassword} onChange={handleNewPasswordChange} />

                <button className='password-update-button' onClick={handlePasswordUpdate}>비밀번호 수정</button>
                
                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }}/>
                <button className='delete-account-button' onClick={handleAccountDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    계정 비활성화
                </button>
            </div>
        </div>
    );
}