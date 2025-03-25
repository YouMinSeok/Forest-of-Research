import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import logoImg from '../assets/logo.png';
import backgroundImg from '../assets/background.jpg'; // 숲 느낌 배경 이미지

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "로그인 실패");
        return;
      }
      alert("로그인 성공!");

      // 로그인 성공 후 /api/auth/me 호출하여 사용자 정보를 세션에 저장
      const userRes = await fetch("http://localhost:8000/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        sessionStorage.setItem("user", JSON.stringify({
          name: userData.user.name,
          student_number: userData.user.student_number || ""
        }));
      }
      
      navigate("/");
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-page-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="block-container">
        <div className="login-box">
          <div className="login-box-left">
            <img src={logoImg} alt="연구의숲 로고" className="login-box-logo" />
            <p className="login-box-subtext">
              “사소한 생각들이 모여<br />무성한 연구의 숲을 만든다”
            </p>
          </div>
          <div className="login-box-right">
            <h2 className="login-title">로그인</h2>
            <div className="login-form-wrapper">
              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field">
                  <label>이메일</label>
                  <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="login-field">
                  <label>비밀번호</label>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="login-btn">로그인</button>
              </form>
              <div className="login-links">
                <div className="login-find">
                  <a href="/find-id">아이디 찾기</a> | <a href="/find-password">비밀번호 찾기</a>
                </div>
                <div className="login-extra">
                  <span>아직 계정이 없으신가요?</span>
                  <Link to="/signup" className="signup-link">회원가입</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
