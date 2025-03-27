import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MainHome.css';

function MainHome() {
  const navigate = useNavigate();

  // ---------- 뉴스 섹션 ----------
  const [newsPosts, setNewsPosts] = useState([]);
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await api.get('/api/board/', { params: { category: '뉴스' } });
        setNewsPosts(response.data);
      } catch (error) {
        console.error('뉴스 데이터 로딩 에러:', error);
      }
    }
    fetchNews();
  }, []);

  // ---------- 공지사항 섹션 ----------
  const [noticePosts, setNoticePosts] = useState([]);
  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await api.get('/api/board/', { params: { category: '공지사항' } });
        setNoticePosts(response.data);
      } catch (error) {
        console.error('공지사항 데이터 로딩 에러:', error);
      }
    }
    fetchNotices();
  }, []);

  // ---------- 연구 섹션 ----------
  const [researchAll, setResearchAll] = useState([]);
  useEffect(() => {
    async function fetchResearch() {
      try {
        const response = await api.get('/api/board/', { params: { category: '연구' } });
        setResearchAll(response.data);
      } catch (error) {
        console.error('연구 데이터 로딩 에러:', error);
      }
    }
    fetchResearch();
  }, []);

  // 탭 메뉴: '전체', '연구자료', '제출자료', '제안서'
  const childCategories = ['전체', '연구자료', '제출자료', '제안서'];
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 페이지네이션 (연구 섹션)
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const currentPosts =
    selectedCategory === '전체'
      ? researchAll
      : researchAll.filter((post) => post.subcategory === selectedCategory);
  const totalPages = Math.ceil(currentPosts.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = currentPosts.slice(startIndex, endIndex);
  const leftItems = pageItems.slice(0, Math.ceil(pageItems.length / 2));
  const rightItems = pageItems.slice(Math.ceil(pageItems.length / 2));

  // ---------- 핸들러 ----------
  // 뉴스와 공지사항 클릭 시 상세 페이지로 이동
  const handleItemClick = (category, post) => {
    navigate(`/community/${category}/${post.id}`, { state: { post } });
  };

  // 연구 게시글 클릭 시 subcategory에 따라 이동 (없으면 기본 "연구자료")
  const handleResearchPostClick = (post) => {
    const sc = post.subcategory || '연구자료';
    navigate(`/community/${sc}/${post.id}`, { state: { post } });
  };

  const handleTabClick = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="main-home-wrapper">
      {/* ---------- 뉴스 섹션 ---------- */}
      <section className="news-section">
        <h2 className="block-title">뉴스</h2>
        {newsPosts.length > 0 ? (
          <>
            <div className="main-news" onClick={() => handleItemClick('뉴스', newsPosts[0])}>
              <div className="main-news-title">{newsPosts[0].title}</div>
              <div className="main-news-content">{newsPosts[0].content}</div>
              <div className="main-news-meta">
                <span>{newsPosts[0].writer}</span>
                <span>{new Date(newsPosts[0].date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="news-lr-container">
              <ul className="news-list left">
                {newsPosts.slice(1, Math.ceil((newsPosts.length - 1) / 2) + 1).map((news) => (
                  <li
                    key={news.id}
                    className="news-item-row"
                    onClick={() => handleItemClick('뉴스', news)}
                  >
                    <span className="news-row-title">{news.title}</span>
                    <span className="news-row-meta">{new Date(news.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
              <ul className="news-list right">
                {newsPosts.slice(Math.ceil((newsPosts.length - 1) / 2) + 1).map((news) => (
                  <li
                    key={news.id}
                    className="news-item-row"
                    onClick={() => handleItemClick('뉴스', news)}
                  >
                    <span className="news-row-title">{news.title}</span>
                    <span className="news-row-meta">{new Date(news.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div>뉴스 게시글이 없습니다.</div>
        )}
      </section>

      {/* ---------- 공지사항 섹션 ---------- */}
      <section className="notice-section">
        <h2 className="block-title">공지사항</h2>
        <div className="notice-list">
          {noticePosts.length > 0 ? (
            noticePosts.slice(0, 5).map((notice) => (
              <div
                key={notice.id}
                className="notice-item"
                onClick={() => handleItemClick('공지사항', notice)}
              >
                <span className="notice-title">
                  {notice.prefix && <span className="post-prefix">{notice.prefix} </span>}
                  {notice.title}
                </span>
                <span className="notice-date">{new Date(notice.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <div>공지사항 게시글이 없습니다.</div>
          )}
        </div>
      </section>

      {/* ---------- 연구 섹션 (2컬럼 + 페이지네이션, 제목만 표시) ---------- */}
      <section className="research-section">
        <h2 className="block-title">연구</h2>
        <hr className="research-divider" />

        {/* 탭 메뉴 */}
        <div className="research-tabs-container">
          <ul className="research-tabs">
            {childCategories.map((cat) => (
              <li
                key={cat}
                className={`research-tab-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleTabClick(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* 2컬럼 게시판 (제목만 표시) */}
        <div className="board-lr-container">
          <ul className="board-list left">
            {leftItems.map((post) => (
              <li
                key={post.id}
                className="board-list-item"
                onClick={() => handleResearchPostClick(post)}
              >
                <span className="board-title">
                  {selectedCategory === '전체'
                    ? '[전체] '
                    : (post.prefix ? post.prefix + ' ' : '')}
                  {post.title}
                </span>
              </li>
            ))}
          </ul>
          <ul className="board-list right">
            {rightItems.map((post) => (
              <li
                key={post.id}
                className="board-list-item"
                onClick={() => handleResearchPostClick(post)}
              >
                <span className="board-title">
                  {selectedCategory === '전체'
                    ? '[전체] '
                    : (post.prefix ? post.prefix + ' ' : '')}
                  {post.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 페이지네이션 */}
        <div className="pagination" style={{ justifyContent: 'flex-end' }}>
          <button className="page-btn" onClick={handlePrevPage} disabled={page <= 1}>
            &lt;
          </button>
          <span className="page-info">
            {page} / {totalPages}
          </span>
          <button className="page-btn" onClick={handleNextPage} disabled={page >= totalPages}>
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
}

export default MainHome;
