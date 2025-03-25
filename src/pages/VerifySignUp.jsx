// src/pages/VerifySignUp.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import signupBg from '../assets/signup-bg.jpg';
import './VerifySignUp.css';

function VerifySignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, email } = location.state || {}; // SignUp.jsx에서 전달받은 role, email

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!role) {
      alert('잘못된 접근입니다. 다시 회원가입을 진행해주세요.');
      navigate('/signup');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        // 백엔드 에러 메시지 표시
        alert(data.detail || "인증 실패");
      } else {
        alert(data.message || `${role === 'student' ? '학생코드' : '교수코드'} 인증 완료!`);
        navigate('/login');
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="verify-outer" style={{ backgroundImage: `url(${signupBg})` }}>
        <div className="verify-card">
          <h2 className="verify-title">잘못된 접근</h2>
          <Link to="/signup" className="signup-link">회원가입으로 이동</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-outer" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="verify-card">
        <div className="verify-info-box">
          <div className="verify-email">
            <strong>{email}</strong>로 전송된 <strong>{role === 'student' ? '학생코드' : '교수코드'}</strong>가 있습니다.
          </div>
          <div className="verify-expire">코드는 4분 후 만료됩니다.</div>
        </div>

        <form onSubmit={handleVerify} className="verify-form">
          <div className="form-group">
            <input
              type="text"
              placeholder={role === 'student' ? '학생코드' : '교수코드'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "검증 중..." : "인증하기"}
          </button>
        </form>

        <div className="verify-extra">
          <Link to="/signup" className="signup-link">← 회원가입 다시 하기</Link>
        </div>
      </div>
    </div>
  );
}

export default VerifySignUp;
