import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import "./Tapmodalbase.css";
import { useNavigate } from 'react-router-dom';
import { authInstance, courseInstance, signIn, signUp } from '../axiosInstance';

export function Tapmodalbase({onClose}){
    const [onTap, setOnTap] = useState('left');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [agreeterm, setAgreeterm] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [receiveMarketing, setreceiveMarketing] = useState(false);
    const DEFAULT_TUTOR_STATUS = 'n';

    const {signInSuccess} = useAuth();
    const navigate = useNavigate();
    
    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handlePhoneChange = (event) => {
        let value = event.target.value;
        const cleanedValue = value.replace(/[^0-9]/g, '');
        let formattedValue = '';
        
        if (cleanedValue.length < 4){
            formattedValue = cleanedValue;
        } else if (cleanedValue.length < 8){
            formattedValue = cleanedValue.substring(0, 3) + '-' + cleanedValue.substring(3);            
        } else if (cleanedValue.length <= 11){
            formattedValue = cleanedValue.substring(0, 3) + '-' + cleanedValue.substring(3, 7) + '-' + cleanedValue.substring(7);
        } else {
            formattedValue = cleanedValue.substring(0, 11);
            formattedValue = formattedValue.substring(0, 3) + '-' + formattedValue.substring(3, 7) + '-' + formattedValue.substring(7);
        }
        setPhone(formattedValue);
    };

    const handleTermsChange = (e) => {setAgreeterm(e.target.checked);};
    const handleMarketingChange = (e) => {setreceiveMarketing(e.target.checked);};
    const handleKeepLoggedInChange = (e) => {
        setKeepLoggedIn(e.target.checked);
    };

    const modalRef = useRef(null);
    const initalFocusRef = useRef(null);
    const activeClass = 'active';

    const handleTapClick = (tapname) => {
        setOnTap(tapname);
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        const signInData = { email, password };

        try {
            const response = await signIn(signInData);
            signInSuccess(response.data);
            navigate('/Main');
            if (onClose) onClose();
        } catch (error) {
            console.error("로그인 실패: ", error);
        }
    };

    const handleSignupSubmit = async () => {
        if (!agreeterm) {
            alert("필수 약관에 동의해 주세요.");
            return;
        }
        const cleanedPhoneNumber = phone.replace(/-/g, '');
        const signUpData = {
            name, email, password,
            phoneNumber: cleanedPhoneNumber,
            agreeTerms: agreeterm,
            receiveMarketing,
            tutor: DEFAULT_TUTOR_STATUS
        };
        try {
            await signUp(signUpData);
            if(onClose) onClose();
        } catch (error) {
            console.error("회원가입 실패: ", error);
        }
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Escape") {
            if (onClose) onClose();
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
            if (initalFocusRef.current) initalFocusRef.current.focus();
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div id='tap-wrapper' role='dialog' aria-modal="true" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
            <div className='Always-area'>
                <img alt='타이틀 아이콘' className="title-image" src="/image/ELC.svg" />
                <span className='catchphrase'>학습의 즐거움을 경험하세요</span>
                <div className='buttonArea'>
                    <button className={`tap-button ${onTap === "left" ? activeClass : ''}`}
                        onClick={() => handleTapClick("left")} ref={onTap === 'left' ? initalFocusRef : null}>로그인</button>
                    <button className={`tap-button ${onTap === "right" ? activeClass : ''}`}
                        onClick={() => handleTapClick("right")} ref={onTap === 'right' ? initalFocusRef : null}>회원가입</button>
                </div>
            </div>
            <div>
                {onTap === "left" && (
                    <div className='signinArea'>
                        <span className='email'>이메일</span>
                        <input type='text' className='sign-email' placeholder='이메일을 입력하세요' value={email} onChange={handleEmailChange}/>
                        <span className='password'>비밀번호</span>
                        <input type='password' className='sign-password' placeholder='비밀번호를 입력하세요' value={password} onChange={handlePasswordChange}/> 
                        <button className='signin-button' onClick={handleSignInSubmit}>로그인</button>
                    </div>
                )}
                {onTap === "right" && (
                    <div className='signupArea'>
                        <span className='upName'>이름</span>
                        <input type='text' className='up-name' placeholder='이름을 입력하세요' value={name} onChange={handleNameChange}/>
                        <span className='upEmail'>이메일</span>
                        <input type='text' className='up-email' placeholder='이메일을 입력하세요' value={email} onChange={handleEmailChange}/>
                        <span className='upNumber'>전화번호</span>
                        <input type='tel' className='up-number' placeholder='010-0000-0000' value={phone} onChange={handlePhoneChange}/>
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

    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handlecourseNameChange = (e) => setCourseName(e.target.value);
    const handlecourselineChange = (e) => setCourseline(e.target.value);
    const handlesubcoursenameChange = (e) => setsubcoursename(e.target.value);
    const handlevideourlChange = (e) => setvideourl(e.target.value);
    const handlecoursepriceChange = (e) => setCourseprice(e.target.value);

    const modalRef = useRef(null);
    const initalFocusRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagename(file.name);
        }
    };

    const uploadToS3 = async (file) => {
        try {
            const response = await courseInstance.get(`/s3/presigned-url?fileName=${encodeURIComponent(file.name)}`);
            const presignedUrl = response.data.url;

        const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (!uploadResponse.ok) throw new Error("S3 서버 전송 실패");

            console.log("보안 업로드 완료!");
            return `image/${file.name}`;
        } catch (error) {
            console.error("업로드 실패:", error);
            throw new Error("이미지 업로드 보안 인증에 실패했습니다.");
        }
    };

    const handlecourseSubmit = async () => {
        if (!courseName || !courseline || !courseprice || !selectedFile) {
            alert('과목명, 계열, 가격, 이미지는 필수 항목입니다.');
            return;
        }

        setIsUploading(true);

        try {
            await uploadToS3(selectedFile);

            const courseRegData = {
                courseName,
                courseline,
                subcoursename,
                imagename,
                videourl,
                courseprice,
            };
            
            await courseInstance.post('/register', courseRegData);
            alert('강의가 성공적으로 등록되었습니다.');
            if (onClose) onClose();
        } catch (error) {
            console.error("강의등록 실패: ", error);
            alert(`등록 실패: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Escape") {
            if (onClose) onClose();
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
            if (initalFocusRef.current) initalFocusRef.current.focus();
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => document.body.classList.remove('modal-open');
    }, []);

    return (
        <div id='adm-wrapper' role='dialog' aria-modal="true" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
            <div className='adm-Always-area'>
                <img alt='타이틀 아이콘' className="title-image" src="/image/ELC.svg" />
                <h2 className='adm-title'>강의 등록</h2> 
            </div>
            
            <div className='courseregArea'>
                <span className='courseName'>과목명</span>
                <input type='text' className='course-name' value={courseName} onChange={handlecourseNameChange} ref={initalFocusRef}/> 
                
                <label className='courseCat'>계열</label>
                <select className='course-select' value={courseline} onChange={handlecourselineChange}>
                    <option value="" disabled>계열을 선택하세요</option>
                    <option value="develop">개발</option>
                    <option value="design">디자인</option>
                    <option value="business">비지니스</option>
                    <option value="macketing">마케팅</option>
                    <option value="photo">사진</option>
                    <option value="music">음악</option>
                </select>
                
                <div className='subcourseaddArea'>
                    <span className='subcoursename'>세부 강의명</span>
                    <input type='text' className='sub-cou-name' value={subcoursename} onChange={handlesubcoursenameChange}/> 
                    
                    <span className='image-url'>이미지 업로드</span>
                    <input type='file' className='image-name' accept="image/*" onChange={handleFileChange} />
                    
                    <span className='videourl'>동영상 주소</span>
                    <input type='text' className='video-url' value={videourl} onChange={handlevideourlChange}/>
                </div>
                
                <span className='courseprice'>강좌 가격</span>
                <input type='number' className='course-price' value={courseprice} onChange={handlecoursepriceChange}/>
                
                <button className='course-reg-button' onClick={handlecourseSubmit} disabled={isUploading}>
                    {isUploading ? "업로드 중..." : "강의 등록"}
                </button>
            </div>
        </div>
    );
}

export function PersonalinfoPage({ onClose }) {
    const { user, token, signout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tutorDetail, setTutorDetail] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState('');

    const isTutor = user && user.tutor === 'y';
    const userUid = user?.uid;

    const modalRef = useRef(null);
    const initalFocusRef = useRef(null);

    const fetchProfile = async () => {
        const response = await authInstance.get(`/users/me`);
        return response.data;
    };

    useEffect(() => {
        if (!token || !userUid) {
            setIsLoading(false);
            return;
        }
        const loadProfile = async () => {
            try {
                const data = await fetchProfile();
                setName(data.name || user.name || '');
                setEmail(data.email || user.email || '');
                setPhoneNumber(data.phoneNumber || '');
                if (isTutor) setTutorDetail(data.tutorDetail || '');
            } catch (error) {
                console.error("프로필 로드 실패", error);
                signout();
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [token, userUid, isTutor, signout, user?.name, user?.email]);

    const handleInfoUpdate = async () => {
        try {
            const data = { phoneNumber, ...(isTutor && { tutorDetail }) };
            await authInstance.put(`/users/myinfo`, data);
            alert("정보가 수정되었습니다.");
        } catch (error) {
            alert("수정 실패");
        }
    };

    if (isLoading) return <div id='info-wrapper' className='loading-modal' />;

    return (
        <div id='info-wrapper' role='dialog' aria-modal="true" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
            <div className='info-Always-area'>
                <img alt='타이틀 아이콘' className="title-image" src="/image/ELC.svg" />
                <h2 className='info-title'>프로필 정보 수정</h2> 
            </div>
            <div className='infomodifyArea'>
                <span className='info-label-name'>이름</span>
                <input type='text' className='info-readonly' value={name} readOnly disabled />
                <span className='info-label-phone'>전화번호</span>
                <input type='tel' className='info-input-phone' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} ref={initalFocusRef}/>
                {isTutor && (
                    <div className='tutor-detail-area'>
                        <span className='tutor-info-label'>상세 설명</span>
                        <textarea className='tutor-info-textarea' value={tutorDetail} onChange={(e) => setTutorDetail(e.target.value)} />
                    </div>
                )}
                <button className='update-button' onClick={handleInfoUpdate}>정보 수정</button>
                <span className='info-label-currentpw'>현재 비밀번호</span>
                <input type='password' className='info-input-currentpw' value={currentPassword} onChange={handleCurrentPasswordChange}/>
                <span className='info-label-newpw'>새 비밀번호</span>
                <input type='password' className='info-input-newpw' value={newPassword} onChange={handleNewPasswordChange} />

                <button className='password-update-button' onClick={handlePasswordUpdate}>비밀번호 수정</button>

                <button className='delete-account-button' onClick={handleAccountDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                    계정 비활성화
                </button>
                <button className='update-button' onClick={handleInfoUpdate}>정보 수정</button>
            </div>
        </div>
    );
}