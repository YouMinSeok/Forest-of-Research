// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainHome from './pages/MainHome';

// 게시판 목록 페이지들
import NoticeBoard from './pages/boards/NoticeBoard';
import NewsBoard from './pages/boards/NewsBoard';
import ResearchDataBoard from './pages/boards/ResearchDataBoard';
import SubmissionDataBoard from './pages/boards/SubmissionDataBoard';
import ProposalBoard from './pages/boards/ProposalBoard';
import FreeBoard from './pages/boards/FreeBoard';

// 공통 상세 페이지 (URL 파라미터로 category와 postId 전달)
import BoardDetail from './pages/boards/BoardDetail';

// 추가 페이지들
import MemoBoardFigmaLike from './components/MemoBoardFigmaLike';  // 스타일 보드
import AcademicSchedule from './pages/AcademicSchedule';            // 대학원 일정 (PDF 웹뷰)
import NotFound from './pages/NotFound';                             // 메모장은 임시로 NotFound로 연결

// 인증 및 기타 페이지
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import VerifySignUp from './pages/VerifySignUp';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인, 회원가입, 인증 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/verify" element={<VerifySignUp />} />

        {/* Layout 및 기타 페이지 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainHome />} />

          {/* 게시판 목록 */}
          <Route path="board/notice" element={<NoticeBoard />} />
          <Route path="board/news" element={<NewsBoard />} />
          <Route path="research/research-data" element={<ResearchDataBoard />} />
          <Route path="research/submission-data" element={<SubmissionDataBoard />} />
          <Route path="research/proposal" element={<ProposalBoard />} />
          <Route path="community/free" element={<FreeBoard />} />

          {/* 공통 상세 페이지 (예: /community/자유게시판/12345) */}
          <Route path="community/:category/:postId" element={<BoardDetail />} />

          {/* 추가 페이지 */}
          <Route path="community/memo" element={<MemoBoardFigmaLike />} />         {/* 스타일 보드 */}
          <Route path="community/notepad" element={<NotFound />} />                  {/* 메모장은 임시 NotFound */}
          <Route path="academic-schedule" element={<AcademicSchedule />} />          {/* 대학원 일정 */}
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
