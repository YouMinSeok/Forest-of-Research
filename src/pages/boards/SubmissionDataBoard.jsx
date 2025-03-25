import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCommon from './BoardCommon';
import { fetchBoardPosts, createBoardPost } from '../../api/board';
import './BoardCommon.css';

function SubmissionDataBoard() {
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
        // 백엔드에서는 연구 게시글을 board="연구"로 저장하므로,
        // 여기서는 모든 연구 게시글 중 subcategory가 "제출자료"인 것만 필터링
        const allResearchPosts = await fetchBoardPosts('연구');
        const submissionData = allResearchPosts.filter(
          (post) => post.subcategory === '제출자료'
        );
        const sortedData = submissionData.sort((a, b) => b.post_number - a.post_number);
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
      // '제출자료'로 작성하면 백엔드에서는 board="연구", subcategory="제출자료" 처리됨
      const response = await createBoardPost('제출자료', newPost);
      setPosts([response, ...posts]);
      setShowWrite(false);
    } catch (error) {
      console.error('글 작성 실패:', error);
    }
  };

  const handlePostClick = (post) => {
    navigate(`/community/제출자료/${post.id}`, { state: { post } });
  };

  return (
    <BoardCommon
      boardName="제출자료"
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

export default SubmissionDataBoard;
