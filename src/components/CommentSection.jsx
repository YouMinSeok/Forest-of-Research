import React, { useState, useEffect } from 'react';
import './CommentSection.css';
import { fetchComments, createComment, deleteComment, getCurrentUser } from '../services/api';

function CommentSection({ postId, onCommentAdded, onCommentDeleted }) {
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // "어떤 댓글"의 드롭다운이 열려 있는지 추적 (commentId)
  const [openDropdownCommentId, setOpenDropdownCommentId] = useState(null);

  // 댓글 목록 불러오기
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(postId);
        setComments(data);
      } catch (error) {
        console.error("댓글을 불러오지 못했습니다.", error);
      }
    };
    loadComments();
  }, [postId]);

  // 현재 로그인된 사용자 정보 불러오기 (/api/auth/me)
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const data = await getCurrentUser();
        setUserName(data.user.name);
        setCurrentUserId(data.user._id || data.user.id);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("로그인된 사용자 정보를 가져오지 못했습니다.", error);
        setUserName("Guest");
        setIsLoggedIn(false);
      }
    };
    loadCurrentUser();
  }, []);

  // 이미지 파일 선택 -> 미리보기
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      alert("댓글 기능은 연구의숲 회원만 가능합니다.");
      return;
    }
    if (!newCommentText.trim() && !previewImage) return;

    const commentData = {
      content: newCommentText,
      image: previewImage,
    };

    try {
      const newComment = await createComment(postId, commentData);
      setComments([...comments, newComment]);
      setNewCommentText("");
      setPreviewImage(null);
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("댓글 등록에 실패했습니다.", error);
    }
  };

  // 드롭다운 열고 닫기
  const toggleDropdown = (commentId) => {
    setOpenDropdownCommentId((prev) => (prev === commentId ? null : commentId));
  };

  // "수정" 버튼 클릭 (현재는 예시로만 구현)
  const handleEditComment = (commentId) => {
    alert(`(예시) 댓글 수정 기능 - commentId: ${commentId}\n실제 로직은 별도 구현 필요.`);
    setOpenDropdownCommentId(null);
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!isLoggedIn) {
      alert("로그인 필요");
      return;
    }
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setOpenDropdownCommentId(null);
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  return (
    <div className="comment-section">
      <h2>댓글</h2>

      {/* 댓글 목록 */}
      <div className="comment-list">
        {comments.map((comment) => {
          // 내 댓글이면 "my-comment" 클래스를 추가
          const isMyComment = (comment.writer_id === currentUserId);

          return (
            <div
              key={comment.id}
              className={`comment-item ${isMyComment ? 'my-comment' : ''}`}
            >
              <div className="comment-header">
                <div>
                  <span className="comment-writer">{comment.writer}</span>
                  <span className="comment-date">
                    {new Date(comment.date).toLocaleString()}
                  </span>
                </div>

                {/* 드롭다운 아이콘: 작성자만 표시 */}
                {isLoggedIn && isMyComment && (
                  <div className="comment-actions">
                    <i
                      className="fas fa-ellipsis-h"
                      onClick={() => toggleDropdown(comment.id)}
                    />
                    {openDropdownCommentId === comment.id && (
                      <div className="dropdown-menu">
                        <div
                          className="dropdown-item"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          수정
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          삭제
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="comment-content">
                <p>{comment.content}</p>
                {comment.image && (
                  <img src={comment.image} alt="댓글 이미지" className="comment-image" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 댓글 작성 영역 */}
      <div className="comment-input-container">
        {isLoggedIn ? (
          <>
            <div className="comment-input-header">{userName}</div>
            <textarea
              className="comment-input-textarea"
              placeholder="댓글을 남겨보세요"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <div className="comment-footer">
              <div className="comment-footer-left">
                <label htmlFor="comment-image-upload" className="comment-icon">
                  <i className="fas fa-camera"></i>
                </label>
                <input
                  id="comment-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <i className="far fa-smile comment-icon"></i>
              </div>
              <span className="comment-submit-text" onClick={handleSubmitComment}>
                등록
              </span>
            </div>
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="미리보기" />
              </div>
            )}
          </>
        ) : (
          <div className="comment-notice">
            댓글 기능은 연구의숲 회원만 가능합니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
