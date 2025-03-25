import React from 'react';
import './BoardCommon.css';
import CafeWritePost from '../../components/CafeWritePost';

/**
 * 공통 게시판 UI 컴포넌트
 * 
 * @param {string}   boardName - 게시판 이름 (예: "자유게시판", "공지사항")
 * @param {Array}    posts - 게시물 목록 (각 post에 title, writer, date, views, post_number 등 포함)
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
 * @param {boolean}  hasFileColumn - 파일 열 표시 여부 (뉴스/공지사항 등에서만 사용)
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
  return (
    <div className="board-page">
      <h2>{boardName} 게시판</h2>

      {!showWrite && (
        <>
          <div className="board-top-bar">
            <div className="board-info">
              총 게시물 <strong>{posts.length}</strong>건
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
              {posts.map((post) => (
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
        </>
      )}

      {showWrite && (
        <CafeWritePost boardList={[boardName]} onSubmit={handleWriteSubmit} />
      )}
    </div>
  );
}

export default BoardCommon;
