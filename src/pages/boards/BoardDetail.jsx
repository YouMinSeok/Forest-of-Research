import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBoardPost, incrementBoardView, likeBoardPost } from '../../api/board';
import CommentSection from '../../components/CommentSection';
import './BoardDetail.css';

function BoardDetail() {
  const { category, postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        await incrementBoardView(postId);
        const data = await fetchBoardPost(postId);
        setPost(data);
      } catch (error) {
        console.error('게시글 로딩 에러:', error);
      }
    }
    loadPost();
  }, [postId]);

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

  const handleCommentIcon = async () => {
    try {
      console.log('댓글 아이콘 클릭 - 서버에서 로그인 검증 후 처리');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        const confirmLogin = window.confirm(
          "이 기능은 연구의숲 회원만 사용 가능합니다.\n로그인하시겠습니까?"
        );
        if (confirmLogin) {
          navigate('/login');
        }
      } else {
        console.error('댓글 에러:', error);
      }
    }
  };

  if (!post) {
    return <div className="loading">로딩 중...</div>;
  }

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
          {/* 기본 toLocaleString() 사용 */}
          <span className="date">{new Date(post.date).toLocaleString()}</span>
        </div>
      </div>

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
          <i className="fas fa-comment"></i> 댓글 {post.commentCount || 0}
        </span>
        <span className="icon-item" onClick={() => console.log('공유 클릭')}>
          <i className="fas fa-share"></i> 공유
        </span>
        <span className="icon-item" onClick={() => console.log('신고 클릭')}>
          <i className="fas fa-exclamation-triangle"></i> 신고
        </span>
      </div>

      <CommentSection postId={post.id} />

      <div className="bottom-buttons">
        <button className="list-btn">목록</button>
        <button className="reply-btn">답글</button>
        <button className="top-btn">TOP</button>
      </div>
    </div>
  );
}

export default BoardDetail;
