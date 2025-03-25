import React, { useState, useEffect } from 'react';
import './CommentSection.css';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  // 추후 백엔드 연동 시 사용자 이름 업데이트 예정
  // 현재는 기본값을 빈 문자열("")로 두고, 빈 경우 "Guest"로 처리합니다.
  const [userName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // (예시) 댓글 목록 불러오기
  useEffect(() => {
    // 실제로는 fetchComments(postId) 등 API 연동
    setComments([]);
  }, [postId]);

  // 이미지 파일 선택 -> 미리보기 처리
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

  // 댓글 등록 함수
  const handleSubmitComment = () => {
    // 내용이 없으면 등록하지 않음
    if (!newCommentText.trim() && !previewImage) return;

    const newComment = {
      id: Date.now(),
      // userName이 비어있으면 "Guest"로 대체
      writer: userName || "Guest",
      content: newCommentText,
      image: previewImage,
      date: new Date().toISOString()
    };

    setComments([...comments, newComment]);
    setNewCommentText("");
    setPreviewImage(null);
  };

  return (
    <div className="comment-section">
      <h2>댓글</h2>

      {/* 댓글 목록 */}
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-writer">{comment.writer}</span>
              <span className="comment-date">
                {new Date(comment.date).toLocaleString()}
              </span>
            </div>
            <div className="comment-content">
              <p>{comment.content}</p>
              {comment.image && (
                <img
                  src={comment.image}
                  alt="댓글 이미지"
                  className="comment-image"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 작성 영역 (하나의 박스) */}
      <div className="comment-input-container">
        {/*
          작성자 이름 표시 영역
          - 추후 백엔드에서 받아올 userName을 표시합니다.
          - 현재는 userName이 비어있을 경우 "Guest"가 표시됩니다.
        */}
        <div className="comment-input-header">
          {userName || "Guest"}
        </div>

        {/* 입력창 */}
        <textarea
          className="comment-input-textarea"
          placeholder="댓글을 남겨보세요"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />

        {/* 하단: 아이콘들(왼쪽) + "등록"(오른쪽) */}
        <div className="comment-footer">
          <div className="comment-footer-left">
            {/* 카메라 아이콘 (파일 업로드) */}
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

            {/* 이모티콘 아이콘 (실제 기능은 없음) */}
            <i className="far fa-smile comment-icon"></i>
          </div>

          {/* "등록"을 텍스트로 클릭 가능하게 */}
          <span className="comment-submit-text" onClick={handleSubmitComment}>
            등록
          </span>
        </div>

        {/* 이미지 미리보기 (선택된 경우만) */}
        {previewImage && (
          <div className="image-preview">
            <img src={previewImage} alt="미리보기" />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
