import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchBoardPosts = async (boardType) => {
  try {
    // boardType를 category로 전달합니다.
    const response = await api.get('/api/board/', { params: { category: boardType } });
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

// 나머지 (fetchBoardPost, incrementBoardView, likeBoardPost)도 그대로 사용

export default api;
