// src/pages/AcademicSchedule.jsx
import React from 'react';
import schedulePdf from '../assets/2025_schedule.pdf'; // src/assets 폴더에 PDF 파일

function AcademicSchedule() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>학사일정</h2>

      {/* 브라우저 기본 PDF 뷰어를 사용하기 위해 iframe 사용 */}
      <iframe
        src={schedulePdf}
        width="100%"
        height="800px"
        style={{ border: 'none' }}
        title="학사일정 PDF"
      />
    </div>
  );
}

export default AcademicSchedule;
