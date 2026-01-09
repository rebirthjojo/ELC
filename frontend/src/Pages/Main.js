import './Main.css'
import { useNavigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { fetchSwiperCourses, fetchCoursesByLine } from '../axiosInstance';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Main = ()=>{

    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState('전체');

    const [swiperCourses, setSwiperCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);

    const handlecourseClick = (lectureTitle) =>{
        navigate(`/Detail/${encodeURIComponent(lectureTitle)}`);
    };

    const handleCheckClick =()=>{
        navigate(`/Checkout/${encodeURIComponent(lectureTitle)}`);
    };
    
    const handleCategoryClick = async (categoryName) => {
        setActiveCategory(categoryName);
        
        setCurrentPage(1);

        const selectedCategory = categories.find(cat => cat.name === categoryName);
        if (selectedCategory) {
            try {
                const response = await fetchCoursesByLine(selectedCategory.lineValue);
                console.log("API 응답 데이터:", response.data);
                setFilteredCourses(mapCourseData(response.data));
            } catch (error) {
                console.error(`카테고리 [${categoryName}] 데이터 로딩 오류:`, error);
                setFilteredCourses(categoryName === '전체' ? mockPopularData : []);
            }
        }
    };

    const mapCourseData = (courseList) => {
        return courseList.map((item, index) => ({
            title: item.lectureName || item.lectureName, 
            subtitle: item.detailedLectureName || item.detailedLectureName,
            
            imageUrl: `/image/${item.image_name || item.imageName}`, 
            price: item.price,
            instructor: item.tutorName || "강사 정보 없음", 
            
            rating: 4.5, 
            students: 1000, 
            duration: "20시간", 
            progress: "50%", 
            category: item.subjectsName, 

        }));
    };

    const categories = [
        {name: '전체', icon: null, lineValue:'전체'},
        {name:'개발', icon: "/image/entire1.png" , alt:"개발아이콘", lineValue:'develop'},
        {name:'디자인', icon: "/image/design1.png", alt:"디자인아이콘", lineValue:'design'},
        {name:'비지니스', icon: "/image/business1.png", alt:"비지니스아이콘", lineValue:'business'},
        {name:'마케팅', icon: "/image/marketing1.png", alt:"마케팅아이콘", lineValue:'marketing'},
        {name:'사진', icon: "/image/picture1.png", alt:"사진아이콘", lineValue:'photo'},
        {name:'음악', icon: "/image/music1.png", alt:"음악아이콘", lineValue:'music'},
        
    ];

    const adContents = [
        {iconSrc: "/image/student1.png", altText: "학생아이콘", text1: "500,000+", text2: "활동 중인 수강생" },
        {iconSrc: "/image/course1.png", altText: "강의아이콘", text1: "10,000+", text2: "전문 강의" },
        {iconSrc: "/image/instructor1.png", altText: "강사아이콘", text1: "1,000+", text2: "전문 강사" },
        {iconSrc: "/image/satisfaction1.png", altText: "만족도아이콘", text1: "95%", text2: "수강생 만족도" },
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 9;

    useEffect(()=>{
        const fetchCourseData = async () => {
            console.log("👉 API 호출 로직 시작! (이 메시지가 보이지 않으면 useEffect 문제)");
            try{
                console.log("API 요청 병렬 실행 중: /api/swiper-courses 및 /api/courses/line/전체");
                
                const [swiperResponse, popularResponse] = await Promise.all([
                    fetchSwiperCourses(),
                    fetchCoursesByLine('전체')
                ]);

                setSwiperCourses(mapCourseData(swiperResponse.data));
                setFilteredCourses(mapCourseData(popularResponse.data));
                
                console.log("초기 데이터 로딩 완료.");
            
                
            }catch (error){
                console.error("데이터를 불러오는 중 오류 발생:", error);

                setSwiperCourses(mockSwiperData); 
                setFilteredCourses(mockPopularData);
            }    
        };
        fetchCourseData();
    }, []);

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // 스와이프 영역
    const CardContent = ({course}) => (
        <div className='cardSectionContent'>
            <div className='cardImage'
                style={{backgroundImage: `url(${course.imageUrl})` }}
            >
                <div className='hotIcon'>
                    <img src="/image/fire-icon.png" alt="hot" />
                    인기강의
                </div>
                <div className='ggimIcon'>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="17.5" fill="#F0F0F0" stroke="#E0E0E0" />
                        <path
                            className="heart-path"
                            d="M18 12.5C14.75 8.75 9 10.35 9 15.5C9 20.65 14.2 24.5 18 27C21.8 
                            24.5 27 20.65 27 15.5C27 10.35 21.25 8.75 18 12.5Z"
                            fill="none"
                            stroke="#6C757D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
            <div className='cardText'>
                <div className='course-area' style={{gridColumn: '1/7', gridRow: '1/2', fontSize: '14px', color: '#666'}}>
                    {course.category}
                </div>
                <div className='course-title' style={{gridColumn: '1/7', gridRow: '2/3', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>
                    {course.title}
                </div>
                <div className='course-subtitle' style={{gridColumn: '1/7', gridRow: '3/4', fontSize: '16px', color: '#4a4a4a', marginBottom: '16px'}}>
                    {course.subtitle}
                </div>
                <div className='course-info' style={{gridColumn: '1/7', gridRow: '4/5', fontSize: '14px', color: '#4a4a4a'}}>
                    ⭐ **{course.rating}** | 🧑 **{course.students.toLocaleString()}명** | ⏱️ **{course.duration}**
                </div>
                <div className='course-instructor' style={{gridColumn: '1/3', gridRow: '5/6', fontSize: '14px', color: '#4a4a4a', marginTop: '16px'}}>
                    {course.instructor}
                </div>
                <div className='course-price' style={{gridColumn: '1/3', gridRow: '6/7', fontSize: '20px', fontWeight: 'bold', color: '#2c6efc'}}>
                    ₩{course.price.toLocaleString()}
                </div>
                <button className='textButton' style={{gridColumn: '6/7', gridRow: '6/7'}} onClick={handleCheckClick}>수강 신청</button>
            </div>
        </div>
    );

    //강의 영역
    const PopularCourseCard = ({ course }) => (
        <div className='courseContent-detail' onClick={() => handlecourseClick(course.title)}>
            <div className='courseImage' style={{backgroundImage: `url(${course.imageUrl})`}} />
            <div className='courseDetail'>
                <div className='popular-title' style={{gridColumn: '1/6', gridRow: '1/2', fontSize: '18px', fontWeight: 'bold'}}>
                    {course.title}
                </div>
                <div className='popular-instructor' style={{gridColumn: '1/6', gridRow: '2/3', fontSize: '14px', color: '#666', marginTop: '4px'}}>
                    {course.instructor}
                </div>
                <div className='popular-info' style={{gridColumn: '1/6', gridRow: '3/4', fontSize: '14px', color: '#4a4a4a', marginTop: '8px'}}>
                    <span style={{fontWeight: 'bold'}}>⭐ {course.rating}</span> | 🧑 {course.students.toLocaleString()} | ⏱️ {course.duration}
                </div>
                <div className='popular-progress' style={{gridColumn: '1/6', gridRow: '4/5', marginTop: '16px'}}>
                    <div style={{width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px'}}>
                        <div style={{width: course.progress, height: '100%', backgroundColor: '#2c6efc', borderRadius: '4px'}}></div>
                    </div>
                    <div style={{fontSize: '12px', color: '#2c6efc', marginTop: '4px', textAlign: 'right'}}>{course.progress}</div>
                </div>
                <div className='popular-price' style={{gridColumn: '1/6', gridRow: '5/6', fontSize: '18px', fontWeight: 'bold', color: '#2c6efc'}}>
                    ₩{course.price.toLocaleString()}
                </div>
            </div>
        </div>
    );

    
return(

        <div className='mainarea'>
            <div className='cardSection'>
                <Swiper
                    modules={[Navigation, Autoplay]}
                    
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation={true}
                    loop={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="mySwiper"
                    style={{maxWidth: '1200px', margin: '0 auto'}}
                >
                    {swiperCourses.map((course, index) => (
                    <SwiperSlide key={index}>
                        <CardContent course={course} />
                    </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className='categorie-border-wrap'>
                <div className='categorie-inner'>
                    {categories.map((cat) => (
                        <div 
                            className={`category-item ${activeCategory === cat.name ? 'selected' : ''}`}
                            onClick={() => handleCategoryClick(cat.name)}
                            key={cat.name}
                        >
                            {cat.icon && <img src={cat.icon} alt={cat.name} />}
                            {cat.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className='mainCourseArea-border'>
                <div className='mainCourseArea-inner'>
                    <div className='courseTitle'>
                        <div className='course-one'>인기강의</div>
                        <div className='course-two'>{filteredCourses.length}개의 강의</div>             
                    </div>
                    <div className='courseContent'>
                        {currentCourses.map((course, index) => (
                            <PopularCourseCard course={course} key={index} />
                        ))}   
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', paddingBottom: '32px', cursor: 'default' }}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ padding: '8px 16px', margin: '0 4px', cursor: 'pointer', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            이전
                        </button>

                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                style={{
                                    padding: '8px 16px',
                                    margin: '0 4px',
                                    cursor: 'pointer',
                                    border: '1px solid #2c6efc',
                                    backgroundColor: currentPage === number ? '#2c6efc' : 'white',
                                    color: currentPage === number ? 'white' : '#2c6efc',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{ padding: '8px 16px', margin: '0 4px', cursor: 'pointer', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                            다음
                        </button>
                    </div>

                </div>
            </div>

            <div className='adArea-border'>
                <div className='adArea-inner'>
                    <div className='adAreaTitle'>신뢰받는 학습 플랫폼</div>
                    <div className='adAreaSubTitle'>수많은 학습자들이 E-Learming과 함께 성장하고 있습니다</div>
                    <div className='adAreaContent-border'>
                        {adContents.map((content, index) => (
                            <div className='adAreaContent-inner' key={index}>
                                <div className='adAreaIcon'>
                                    <img src={content.iconSrc} alt={content.altText} />
                                </div>
                                <div className='adAreaText1'>
                                    {content.text1}
                                </div>
                                <div className='adAreaText2'>
                                    {content.text2}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
export default Main;

const mockSwiperData = [
    { 
        category: "개발", 
        title: "TypeScript 완벽 가이드", 
        subtitle: "기초부터 고급 기능까지, TypeScript의 모든 것을 배워보세요.", 
        rating: 4.9, 
        students: 23450, 
        duration: "32시간", 
        instructor: "개발자", 
        price: 89000,
        imageUrl: "/image/develop1.jpg"
    },
    
    { category: "디자인", title: "어도비 XD UI/UX 마스터", subtitle: "실무 프로젝트로 배우는 디자인", rating: 4.7, students: 15000, duration: "20시간", instructor: "디자이너", price: 79000, imageUrl: "/image/ps.jpg" },
    { category: "마케팅", title: "검색 엔진 최적화 (SEO)", subtitle: "상위 노출을 위한 실전 전략", rating: 4.8, students: 18000, duration: "25시간", instructor: "마케터", price: 95000, imageUrl: "/image/marketing.jpg" },
    { category: "비지니스", title: "데이터 기반 비즈니스 분석", subtitle: "Excel을 활용한 의사 결정", rating: 4.6, students: 12000, duration: "30시간", instructor: "분석가", price: 85000, imageUrl: "/image/business.jpg" },
    { category: "음악", title: "Ableton Live를 활용한 미디 작곡", subtitle: "나만의 음악을 만드는 방법", rating: 4.9, students: 9000, duration: "40시간", instructor: "작곡가", price: 99000, imageUrl: "/image/music.jpg" },
];

const mockPopularData = [
    { title: "리액트 웹 마스터", instructor: "김개발", rating: 4.8, students: 15234, duration: "24시간", price: 89000, progress: "35%", imageUrl: "/image/course-image.jpg" },
    { title: "UI/UX 디자인 시스템 구축하기", instructor: "박디자인", rating: 4.9, students: 9876, duration: "18시간", price: 79000, progress: "80%", imageUrl: "/image/ps.jpg" },
    { title: "스타트업 창업과 비즈니스 전략", instructor: "이사장", rating: 4.7, students: 12543, duration: "32시간", price: 99000, progress: "10%", imageUrl: "/image/business.jpg" },
    { title: "파이썬 데이터 분석 입문", instructor: "최분석", rating: 4.5, students: 10500, duration: "28시간", price: 75000, progress: "60%", imageUrl: "/image/ps.jpg" },
    { title: "모바일 사진 촬영 & 편집", instructor: "정작가", rating: 4.9, students: 20100, duration: "10시간", price: 69000, progress: "95%", imageUrl: "/image/picture.jpg" },
    { title: "자바 스프링 부트 실전", instructor: "홍길동", rating: 4.8, students: 17800, duration: "50시간", price: 109000, progress: "45%", imageUrl: "/image/course-image.jpg" },
    { title: "파이썬 데이터 분석 입문", instructor: "최분석", rating: 4.5, students: 10500, duration: "28시간", price: 75000, progress: "60%", imageUrl: "/image/business.jpg" },
    { title: "모바일 사진 촬영 & 편집", instructor: "정작가", rating: 4.9, students: 20100, duration: "10시간", price: 69000, progress: "95%", imageUrl: "/image/picture.jpg" },
    { title: "자바 스프링 부트 실전", instructor: "홍길동", rating: 4.8, students: 17800, duration: "50시간", price: 109000, progress: "45%", imageUrl: "/image/marketing.jpg" },
    { title: "리액트 웹 마스터", instructor: "김개발", rating: 4.8, students: 15234, duration: "24시간", price: 89000, progress: "35%", imageUrl: "/image/course-image.jpg" },
    { title: "UI/UX 디자인 시스템 구축하기", instructor: "박디자인", rating: 4.9, students: 9876, duration: "18시간", price: 79000, progress: "80%", imageUrl: "/image/ps.jpg" },
    { title: "스타트업 창업과 비즈니스 전략", instructor: "이사장", rating: 4.7, students: 12543, duration: "32시간", price: 99000, progress: "10%", imageUrl: "/image/business.jpg" },
    { title: "파이썬 데이터 분석 입문", instructor: "최분석", rating: 4.5, students: 10500, duration: "28시간", price: 75000, progress: "60%", imageUrl: "/image/ps.jpg" },
    { title: "모바일 사진 촬영 & 편집", instructor: "정작가", rating: 4.9, students: 20100, duration: "10시간", price: 69000, progress: "95%", imageUrl: "/image/picture.jpg" },
    { title: "자바 스프링 부트 실전", instructor: "홍길동", rating: 4.8, students: 17800, duration: "50시간", price: 109000, progress: "45%", imageUrl: "/image/course-image.jpg" },
    { title: "파이썬 데이터 분석 입문", instructor: "최분석", rating: 4.5, students: 10500, duration: "28시간", price: 75000, progress: "60%", imageUrl: "/image/business.jpg" },
    { title: "모바일 사진 촬영 & 편집", instructor: "정작가", rating: 4.9, students: 20100, duration: "10시간", price: 69000, progress: "95%", imageUrl: "/image/picture.jpg" },
    { title: "자바 스프링 부트 실전", instructor: "홍길동", rating: 4.8, students: 17800, duration: "50시간", price: 109000, progress: "45%", imageUrl: "/image/marketing.jpg" },
];