import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCommon from './BoardCommon';
import { fetchBoardPosts, createBoardPost } from '../../api/board';
import './BoardCommon.css';

function ResearchDataBoard() {
  const [posts, setPosts] = useState([]);
  const [showWrite, setShowWrite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchFilter, setSearchFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
    setIsLoggedIn(!!userData);
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // 연구 게시글은 board="연구"로 저장됨.
        // 여기서는 subcategory가 "연구자료"인 게시글만 필터링
        const allResearchPosts = await fetchBoardPosts('연구');
        const researchData = allResearchPosts.filter(
          (post) => post.subcategory === '연구자료'
        );
        const sortedData = researchData.sort((a, b) => b.post_number - a.post_number);
        setPosts(sortedData);
      } catch (error) {
        console.error('게시글 로딩 에러:', error);
      }
    };
    loadPosts();
  }, []);

  const handleSearch = () => {
    alert('검색 기능(추후 구현)');
  };

  const handleWriteButton = () => {
    if (!isLoggedIn) {
      alert('글 작성을 위해서는 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setShowWrite(true);
  };

  const handleWriteSubmit = async (newPost) => {
    try {
      // "연구자료"로 작성하면 백엔드에서 board="연구", subcategory="연구자료" 처리됨
      const response = await createBoardPost('연구자료', newPost);
      setPosts([response, ...posts]);
      setShowWrite(false);
    } catch (error) {
      console.error('글 작성 실패:', error);
    }
  };

  const handlePostClick = (post) => {
    navigate(`/community/연구자료/${post.id}`, { state: { post } });
  };

  return (
    <BoardCommon
      boardName="연구자료"
      posts={posts}
      showWrite={showWrite}
      isLoggedIn={isLoggedIn}
      searchFilter={searchFilter}
      setSearchFilter={setSearchFilter}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      handleWriteButton={handleWriteButton}
      handlePostClick={handlePostClick}
      handleWriteSubmit={handleWriteSubmit}
      hasFileColumn={false}
    />
  );
}

export default ResearchDataBoard;
