import React, { useState } from 'react';
import './BoardCommon.css';
import CafeWritePost from '../../components/CafeWritePost';

/**
 * 공통 게시판 UI 컴포넌트
 * 
 * @param {string}   boardName - 게시판 이름 (예: "자유게시판", "공지사항")
 * @param {Array}    posts - 전체 게시물 목록
 * @param {boolean}  showWrite - 글 작성 폼 표시 여부
 * @param {boolean}  isLoggedIn - 로그인 여부
 * @param {string}   searchFilter - 검색 필터
 * @param {string}   searchQuery - 검색어
 * @param {Function} setSearchFilter - 검색 필터 변경 함수
 * @param {Function} setSearchQuery - 검색어 변경 함수
 * @param {Function} handleSearch - 검색 버튼 클릭 핸들러
 * @param {Function} handleWriteButton - 글 작성 버튼 클릭 핸들러
 * @param {Function} handlePostClick - 게시글 클릭 시 상세 페이지 이동
 * @param {Function} handleWriteSubmit - 글 작성 폼 제출 핸들러
 * @param {boolean}  hasFileColumn - 파일 열 표시 여부
 */
function BoardCommon({
  boardName,
  posts,
  showWrite,
  isLoggedIn,
  searchFilter,
  searchQuery,
  setSearchFilter,
  setSearchQuery,
  handleSearch,
  handleWriteButton,
  handlePostClick,
  handleWriteSubmit,
  hasFileColumn,
}) {
  // =============================
  // 페이지네이션 상태 & 로직
  // =============================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // 페이지당 게시글 수
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  // 현재 페이지에 표시할 게시글 목록 (slice)
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = posts.slice(startIndex, endIndex);

  // 페이지 버튼 클릭 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // "이전" 버튼 핸들러
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // "다음" 버튼 핸들러
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="board-page">
      <h2>{boardName} 게시판</h2>

      {/* 글 작성 폼이 아닐 때만 검색/목록 표시 */}
      {!showWrite && (
        <>
          <div className="board-top-bar">
            <div className="board-info">
              총 게시물 <strong>{totalPosts}</strong>건
            </div>
            <div className="board-search-area">
              <select
                className="board-filter"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="writer">작성자</option>
                <option value="content">내용</option>
              </select>
              <input
                type="text"
                className="board-search-input"
                placeholder="검색어 입력"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="board-search-btn" onClick={handleSearch}>
                검색
              </button>
              {isLoggedIn && (
                <button className="write-btn" onClick={handleWriteButton}>
                  글 작성
                </button>
              )}
            </div>
          </div>

          <table className="board-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>번호</th>
                <th>제목</th>
                <th style={{ width: '100px' }}>작성자</th>
                <th style={{ width: '120px' }}>날짜</th>
                <th style={{ width: '60px' }}>조회</th>
                {hasFileColumn && <th style={{ width: '60px' }}>파일</th>}
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => (
                <tr
                  key={post.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handlePostClick(post)}
                >
                  <td>{post.post_number}</td>
                  <td className="post-title">
                    {post.prefix && (
                      <span className="post-prefix">{post.prefix} </span>
                    )}
                    {post.title}
                  </td>
                  <td>{post.writer}</td>
                  {/* 기본 toLocaleDateString() 사용 */}
                  <td>{new Date(post.date).toLocaleDateString()}</td>
                  <td>{post.views}</td>
                  {hasFileColumn && <td>-</td>}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 영역 */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="page-btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {/* 글 작성 폼 표시 */}
      {showWrite && (
        <CafeWritePost boardList={[boardName]} onSubmit={handleWriteSubmit} />
      )}
    </div>
  );
}

export default BoardCommon;
