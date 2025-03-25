import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TopNav.css';
import logoImg from '../assets/logo.png';

function TopNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("사용자 정보 로드 오류:", error);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        sessionStorage.removeItem("user");
        navigate("/");
      } else {
        alert("로그아웃에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그아웃 요청 오류:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <header className="topnav">
      {/* 첫 번째 줄: 큰 배경 + 로고(왼쪽) */}
      <div className="topnav-top">
        <div className="topnav-left">
          <Link to="/" className="site-logo">
            {/* 로고 이미지 크기를 크게 (width=200px 등) */}
            <img src={logoImg} alt="연구의숲 로고" className="logo-img" />
          </Link>
        </div>
      </div>

      {/* 두 번째 줄: 메뉴(가운데) + 로그인/회원가입 or 사용자/로그아웃(오른쪽) */}
      <div className="topnav-lower">
        {/* 가운데 메뉴 */}
        <div className="lower-center">
          <nav className="topnav-menu">
            <ul>
              <li><Link to="/">홈</Link></li>
              <li><Link to="/research-project">연구프로젝트</Link></li>
              <li><Link to="/idea">아이디어 창고</Link></li>
              <li><Link to="/my-menu">마이메뉴</Link></li>
            </ul>
          </nav>
        </div>

        {/* 오른쪽 로그인/회원가입 or 사용자/로그아웃 */}
        <div className="lower-right">
          {user ? (
            <>
              <span className="user-info">
                {user.student_number
                  ? `${user.student_number} / ${user.name}`
                  : user.name}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">로그인</Link>
              <span className="divider">|</span>
              <Link to="/signup" className="auth-link">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopNav;
