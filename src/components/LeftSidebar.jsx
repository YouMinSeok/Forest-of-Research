// src/components/LeftSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LeftSidebar.css';

function LeftSidebar() {
  return (
    <aside className="left-sidebar">
      {/* 뉴스 (단일 항목 - 최상단) */}
      <div className="news-item">
        <Link to="/board/news">뉴스</Link>
      </div>

      {/* 연구실 운영 */}
      <div className="category-block">
        <h2 className="category-title">연구실 운영</h2>
        <ul className="sub-list">
          <li><Link to="/board/notice">공지사항</Link></li>
          <li><Link to="/board/meeting-records">회의록 & 미팅 기록</Link></li>
        </ul>
      </div>

      {/* 연구 */}
      <div className="category-block">
        <h2 className="category-title">연구</h2>
        <ul className="sub-list">
          <li><Link to="/research/research-data">연구자료</Link></li>
          <li><Link to="/research/submission-data">제출자료</Link></li>
          <li><Link to="/research/proposal">제안서</Link></li>
        </ul>
      </div>

      {/* 논문 관리 */}
      <div className="category-block">
        <h2 className="category-title">논문 관리</h2>
        <ul className="sub-list">
          <li><Link to="/thesis/database">논문 데이터베이스</Link></li>
          <li><Link to="/thesis/guide">논문 작성 가이드</Link></li>
          <li><Link to="/thesis/feedback">논문 피드백 & 리뷰</Link></li>
          <li><Link to="/thesis/submission">논문 제출 & 승인</Link></li>
        </ul>
      </div>

      {/* 연구 커뮤니티 */}
      <div className="category-block">
        <h2 className="category-title">연구 커뮤니티</h2>
        <ul className="sub-list">
          <li><Link to="/community/free">자유게시판</Link></li>
          <li><Link to="/community/qa">연구 Q&A</Link></li>
          <li><Link to="/community/memo">스타일 보드</Link></li>
          <li><Link to="/community/notepad">메모장</Link></li>  {/* 새롭게 추가된 메모장 */}
        </ul>
      </div>
    </aside>
  );
}

export default LeftSidebar;
