import axios from 'axios';

// fallback 제거
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 만약 환경변수가 설정되지 않았다면 빌드 시점에 에러 발생
if (!API_BASE_URL) {
  throw new Error("REACT_APP_API_BASE_URL is not defined! Please set it in your environment variables.");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// 게시글 관련 API
export const fetchBoardPosts = async (boardType) => {
  try {
    const response = await api.get('/api/board/', {
      params: { category: boardType },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 가져오기 실패:", error.response?.data || error.message);
    throw error;
  }
};

export const createBoardPost = async (boardType, postData) => {
  try {
    const response = await api.post('/api/board/create', {
      board: boardType,
      ...postData,
    });
    return response.data;
  } catch (error) {
    console.error("게시글 생성 실패:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchBoardPost = async (postId) => {
  try {
    const response = await api.get(`/api/board/${postId}`);
    return response.data;
  } catch (error) {
    console.error("단일 게시글 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};

export const incrementBoardView = async (postId) => {
  try {
    const response = await api.post(`/api/board/${postId}/view`);
    return response.data;
  } catch (error) {
    console.error("조회수 증가 실패:", error.response?.data || error.message);
    throw error;
  }
};

export const likeBoardPost = async (postId) => {
  try {
    const response = await api.post(`/api/board/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("좋아요 처리 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 댓글 관련 API
export const fetchComments = async (postId) => {
  try {
    const response = await api.get(`/api/board/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("댓글 가져오기 실패:", error.response?.data || error.message);
    throw error;
  }
};

export const createComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/api/board/${postId}/comments/create`, commentData);
    return response.data;
  } catch (error) {
    console.error("댓글 작성 실패:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    const response = await api.delete(`/api/board/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 현재 로그인된 사용자 정보 가져오기 (/api/auth/me)
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data; // 예: { user: { _id, name, email, ... } }
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
