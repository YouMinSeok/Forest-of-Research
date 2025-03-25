import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
import signupBg from '../assets/signup-bg.jpg'; // 배경 이미지

function SignUp() {
  const navigate = useNavigate();

  // step: 0 → 역할 선택, 1 → 회원가입 폼
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');

  // 학생 전용 필드
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');

  // 공통 필드
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // 간단한 정규식 (대문자/소문자/숫자/특수문자 최소 1개씩, 8자 이상)
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  // 이름은 알파벳, 한글, 공백만 허용 (2자 이상)
  const nameRegex = /^[A-Za-z가-힣\s]{2,}$/;

  // 역할 선택
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setStep(1);
  };

  // 뒤로가기
  const handleBack = () => {
    setRole('');
    setStep(0);
    setName('');
    setStudentNumber('');
    setPassword('');
    setEmail('');
  };

  // **백엔드 오류 메시지 → 커스텀 문구 변환 함수**
  const formatBackendError = (detail) => {
    if (typeof detail !== "string") {
      return "회원가입에 실패했습니다."; // detail이 문자열이 아닐 경우 포괄적 문구
    }

    // 서버에서 내려오는 detail이 다음과 같다고 가정:
    // - "이미 사용중인 이메일입니다."
    // - "이미 사용중인 이름입니다."
    // - 그 외
    if (detail.includes("이미 사용중인 이메일입니다.")) {
      return "이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.";
    }
    if (detail.includes("이미 사용중인 이름입니다.")) {
      return "이미 사용 중인 이름입니다. 다른 이름을 사용해주세요.";
    }
    if (detail.includes("이름은 알파벳, 한글, 공백만 허용됩니다.")) {
      return "이름 형식이 올바르지 않습니다. (알파벳, 한글, 공백만 허용 2자 이상)";
    }
    if (detail.includes("비밀번호에 최소 하나의 대문자가 필요합니다.")) {
      return "비밀번호 형식이 올바르지 않습니다. (대문자 최소 1개)";
    }
    // ... 필요한 경우 추가 분기
    return "회원가입에 실패했습니다.";
  };

  // 회원가입 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // **1) 클라이언트단 사전 검증**
    if (role === 'student') {
      // 이름 정규식 확인
      if (!nameRegex.test(name)) {
        alert("이름은 2자 이상, 알파벳/한글/공백만 허용됩니다.");
        return;
      }
      // 학번 간단 체크
      if (!studentNumber.trim()) {
        alert("학번을 입력해주세요.");
        return;
      }
    }

    // 비밀번호 형식 체크
    if (!passwordRegex.test(password)) {
      alert("비밀번호 형식이 올바르지 않습니다.\n(대문자, 소문자, 숫자, 특수문자 포함 8자 이상)");
      return;
    }

    // 이메일 입력 여부
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // **2) 백엔드에 전송할 폼 데이터 준비**
    let payload = { password, email, role };
    if (role === 'student') {
      payload.name = name;
      payload.student_number = studentNumber;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      // **3) 백엔드 응답 처리**
      if (!res.ok) {
        // 백엔드 오류 메시지(예: data.detail) → 커스텀 문구
        const customMsg = formatBackendError(data.detail || "");
        alert(customMsg);
        return;
      }

      // 회원가입 성공
      alert(data.message); // "회원가입 요청 완료. 인증 코드가 전송되었습니다." 등
      // 인증 단계로 이동
      navigate('/signup/verify', { state: { role, email } });
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-outer" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="signup-card">
        {step === 0 && (
          <div className="signup-box">
            <h2 className="signup-title">회원 유형을 선택해주세요</h2>
            <div className="role-selection-container">
              <button className="role-card" onClick={() => handleRoleSelection('student')}>
                <div className="role-icon">🎓</div>
                <div className="role-text">학생</div>
              </button>
              <div className="or-text">or</div>
              <button className="role-card" onClick={() => handleRoleSelection('professor')}>
                <div className="role-icon">👨‍🏫</div>
                <div className="role-text">교수</div>
              </button>
            </div>
            <div className="signup-extra">
              <span>이미 계정이 있으신가요?</span>
              <Link to="/login" className="signup-link">로그인</Link>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="signup-box">
            <h2 className="signup-title">
              {role === 'student' ? '학생 회원가입' : '교수 회원가입'}
            </h2>

            <div className="signup-form-wrapper">
              <form onSubmit={handleSubmit} className="signup-form">
                {role === 'student' && (
                  <>
                    <div className="form-group">
                      <label>이름</label>
                      <input
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>학번</label>
                      <input
                        type="text"
                        placeholder="학번"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>비밀번호</label>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {role === 'student' ? (
                  <div className="form-group">
                    <label>이메일</label>
                    <input
                      type="email"
                      placeholder="이메일"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>도메인 이메일</label>
                    <input
                      type="email"
                      placeholder="your@domain.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                )}

                <button type="submit" className="signup-btn">회원가입</button>
              </form>

              <button className="signup-back-btn" onClick={handleBack}>← 뒤로</button>

              <div className="signup-extra">
                <span>이미 계정이 있으신가요?</span>
                <Link to="/login" className="signup-link">로그인</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
