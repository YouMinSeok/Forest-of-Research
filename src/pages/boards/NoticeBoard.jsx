import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCommon from './BoardCommon';
import { fetchBoardPosts, createBoardPost } from '../../api/board';
import './BoardCommon.css';

function NoticeBoard() {
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
        const data = await fetchBoardPosts('공지사항');
        // post_number 기준 내림차순 정렬 (백엔드에도 적용되어 있다면 여기선 안전하게 정렬)
        const sortedData = data.sort((a, b) => b.post_number - a.post_number);
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
      const response = await createBoardPost('공지사항', newPost);
      setPosts([response, ...posts]);
      setShowWrite(false);
    } catch (error) {
      console.error('글 작성 실패:', error);
    }
  };

  const handlePostClick = (post) => {
    navigate(`/community/공지사항/${post.id}`, { state: { post } });
  };

  return (
    <BoardCommon
      boardName="공지사항"
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
      hasFileColumn={true}
    />
  );
}

export default NoticeBoard;
