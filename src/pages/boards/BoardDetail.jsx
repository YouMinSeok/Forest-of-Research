import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-quill/dist/quill.snow.css';  // Quill 기본 스타일 추가
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardPost, incrementBoardView, likeBoardPost } from '../../api/board';
import CommentSection from '../../components/CommentSection';
import './BoardDetail.css';

function BoardDetail() {
  const { category, postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [commentCount, setCommentCount] = useState(0); // 댓글 수 상태

  useEffect(() => {
    async function loadPost() {
      try {
        // 조회수 증가
        await incrementBoardView(postId);
        // 게시글 상세 불러오기
        const data = await fetchBoardPost(postId);
        setPost(data);
        setCommentCount(data.commentCount || 0);
      } catch (error) {
        console.error('게시글 로딩 에러:', error);
      }
    }
    loadPost();
  }, [postId]);

  // 좋아요 처리
  const handleLike = async () => {
    try {
      await likeBoardPost(postId);
      const data = await fetchBoardPost(postId);
      setPost(data);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        const confirmLogin = window.confirm(
          "이 기능은 연구의숲 회원만 사용 가능합니다.\n로그인하시겠습니까?"
        );
        if (confirmLogin) {
          navigate('/login');
        }
      } else {
        console.error('좋아요 에러:', error);
      }
    }
  };

  // 댓글 아이콘 클릭 시 (필요 시 로그인 체크)
  const handleCommentIcon = () => {
    console.log('댓글 아이콘 클릭');
  };

  // 댓글 추가 시 댓글 수 +1
  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  // 댓글 삭제 시 댓글 수 -1
  const handleCommentDeleted = () => {
    setCommentCount(prev => prev - 1);
  };

  if (!post) {
    return <div className="loading">로딩 중...</div>;
  }

  // 제목은 plain text 처리
  const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };
  const plainTitle = stripHtmlTags(post.title);

  return (
    <div className="board-detail-container">
      <div className="post-header">
        <div className="post-category">[{category}]</div>
        <h1 className="post-title">
          {post.prefix && <span className="post-prefix">{post.prefix} </span>}
          {plainTitle}
        </h1>
        <div className="post-meta">
          <span className="writer">{post.writer}</span>
          <span className="date">{new Date(post.date).toLocaleString()}</span>
        </div>
      </div>

      {/* Quill 등에서 생성된 HTML을 그대로 표시 */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="content-divider" />

      <div className="post-icons">
        <span className="icon-item" onClick={handleLike}>
          <i className="fas fa-heart"></i> 좋아요 {post.likes || 0}
        </span>
        <span className="icon-item">
          <i className="fas fa-eye"></i> 조회수 {post.views || 0}
        </span>
        <span className="icon-item" onClick={handleCommentIcon}>
          <i className="fas fa-comment"></i> 댓글 {commentCount}
        </span>
      </div>

      {/* CommentSection 컴포넌트에 댓글 추가/삭제 콜백 전달 */}
      <CommentSection
        postId={post.id}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
      />

      <div className="bottom-buttons">
        <button className="list-btn">목록</button>
        <button className="reply-btn">답글</button>
        <button className="top-btn">TOP</button>
      </div>
    </div>
  );
}

export default BoardDetail;
