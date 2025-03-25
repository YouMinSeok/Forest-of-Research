import api from '../services/api';

// 게시글 목록 조회
export const fetchBoardPosts = async (boardType) => {
  try {
    const response = await api.get('/api/board/', {
      params: { category: boardType },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching board posts:", error.response?.data || error.message);
    throw error;
  }
};

// 새 게시글 생성 (로그인 필요)
export const createBoardPost = async (boardType, postData) => {
  try {
    const response = await api.post('/api/board/create', {
      board: boardType,
      ...postData,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating board post:", error.response?.data || error.message);
    throw error;
  }
};

// 단일 게시글 조회 (postId로)
export const fetchBoardPost = async (postId) => {
  try {
    const response = await api.get(`/api/board/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching single board post:", error.response?.data || error.message);
    throw error;
  }
};

// 조회수 증가
export const incrementBoardView = async (postId) => {
  try {
    const response = await api.post(`/api/board/${postId}/view`);
    return response.data;
  } catch (error) {
    console.error("Error incrementing view count:", error.response?.data || error.message);
    throw error;
  }
};

// 좋아요 증가
export const likeBoardPost = async (postId) => {
  try {
    const response = await api.post(`/api/board/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking board post:", error.response?.data || error.message);
    throw error;
  }
};
