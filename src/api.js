import axios from "axios";

// Create React App 환경 변수 사용 (프로젝트 루트에 .env 파일에 REACT_APP_API_BASE_URL 변수를 설정)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchBoardPosts = async () => {
  try {
    const response = await api.get("/board/");
    return response.data;
  } catch (error) {
    console.error("게시글 가져오기 실패:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
