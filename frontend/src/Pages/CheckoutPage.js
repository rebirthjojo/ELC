import React from 'react';
import { CreditCard, Landmark, Smartphone, Check } from 'lucide-react';
import './CheckoutPage.css';

const CheckoutPage = () => {
  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <div className="checkout-main">
          <section className="checkout-section">
            <h2 className="section-title">주문자 정보</h2>
            <div className="input-group">
              <label>이름</label>
              <input type="text" placeholder="홍길동" />
            </div>
            <div className="input-group">
              <label>이메일</label>
              <input type="email" placeholder="example@email.com" />
            </div>
            <div className="input-group">
              <label>연락처</label>
              <input type="text" placeholder="010-0000-0000" />
            </div>
          </section>

          <section className="checkout-section">
            <h2 className="section-title">결제 수단</h2>
            <div className="payment-option active">
              <input type="radio" name="payment" checked readOnly />
              <CreditCard size={20} />
              <span>신용/체크카드</span>
            </div>
            <div className="payment-option">
              <input type="radio" name="payment" />
              <Landmark size={20} />
              <span className="text-muted">실시간 계좌이체</span>
            </div>
            <div className="payment-option">
              <input type="radio" name="payment" />
              <Smartphone size={20} />
              <span className="text-muted">휴대폰 결제</span>
            </div>

            <div className="card-details">
              <div className="input-group">
                <label>카드번호</label>
                <input type="text" placeholder="0000-0000-0000-0000" />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>유효기간</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="input-group">
                  <label>CVC</label>
                  <input type="password" placeholder="000" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="checkout-sidebar">
          <div className="summary-card">
            <h2 className="section-title">주문 요약</h2>
            <div className="course-info">
              <div className="thumbnail-placeholder">
                {/* 실제 이미지가 들어갈 자리 */}
              </div>
              <div>
                <div className="course-name">TypeScript 완벽 가이드</div>
                <div className="instructor-name">김개발</div>
              </div>
            </div>
            
            <div className="price-row">
              <span>강의 금액</span>
              <span className="font-bold">₩89,000</span>
            </div>
            <div className="total-row">
              <span>최종 결제금액</span>
              <span className="total-price">₩89,000</span>
            </div>
            
            <div className="benefits-box">
              <div className="benefit-item"><Check size={16} strokeWidth={3}/> 평생 수강 가능</div>
              <div className="benefit-item"><Check size={16} strokeWidth={3}/> 모바일/PC 모두 지원</div>
              <div className="benefit-item"><Check size={16} strokeWidth={3}/> 수료증 발급</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;