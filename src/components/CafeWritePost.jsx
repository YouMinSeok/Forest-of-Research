import React, { useState, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CafeWritePost.css';
import LinkModal from './LinkModal';

/* (1) 커스텀 폰트 등록 */
const Font = Quill.import('formats/font');
Font.whitelist = ['notoSansKR', 'nanumGothic', 'nanumMyeongjo', 'nanumSquare'];
Quill.register(Font, true);

/* (2) 글자 크기(size) 커스텀 */
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px'];
Quill.register(Size, true);

function CafeWritePost({ boardList, onSubmit }) {
  // 공지사항 말머리 옵션
  const prefixOptions = {
    공지사항: ['필독', '공지', '업데이트']
  };

  // 제안서의 2차 말머리 옵션
  const secondPrefixOptions = [
    { value: '', label: '선택안함' },
    { value: '초안', label: '초안' },
    { value: '1차 피드백 요청', label: '1차 피드백 요청' },
    { value: '2차 피드백 요청', label: '2차 피드백 요청' },
    { value: '수정중', label: '수정중' },
    { value: '최종안', label: '최종안' },
    { value: '완료', label: '완료' },
    { value: '보류', label: '보류' }
  ];

  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedPrefix, setSelectedPrefix] = useState('');
  const [selectedSecondPrefix, setSelectedSecondPrefix] = useState('');
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [tags, setTags] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  // Quill ref
  const quillRef = useRef(null);

  // Quill modules & formats (툴바 구성)
  const modules = useMemo(() => ({
    toolbar: {
      container: '#custom-toolbar',
      handlers: {
        // 링크 버튼 클릭 시 모달을 오픈
        link: () => setLinkModalOpen(true)
      }
    }
  }), []);

  const formats = useMemo(
    () => [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike',
      'blockquote', 'code-block',
      'list', 'script', 'indent', 'direction',
      'color', 'background', 'align',
      'link', 'image', 'video', 'formula',
      'clean'
    ],
    []
  );

  // 게시판/말머리 선택 핸들러
  const handleBoardChange = (e) => {
    const board = e.target.value;
    setSelectedBoard(board);

    if (board === '공지사항') {
      setSelectedPrefix(prefixOptions['공지사항'][0]);
      setSelectedSecondPrefix('');
    } else if (board === '제안서') {
      setSelectedPrefix('제안서');
      setSelectedSecondPrefix('');
    } else {
      setSelectedPrefix('');
      setSelectedSecondPrefix('');
    }
  };

  // 등록 버튼 핸들러
  const handleSubmit = () => {
    if (!selectedBoard) {
      alert('게시판을 선택하세요.');
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }
    if (!editorContent.trim()) {
      alert('내용을 입력하세요.');
      return;
    }

    let finalPrefix = '';
    if (selectedBoard === '공지사항') {
      if (!selectedPrefix) {
        alert('말머리를 선택하세요.');
        return;
      }
      finalPrefix = `[${selectedPrefix}]`;
    } else if (selectedBoard === '제안서') {
      finalPrefix = '[제안서]';
      if (selectedSecondPrefix) {
        finalPrefix += ` [${selectedSecondPrefix}]`;
      }
    }

    const tagArr = tags
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t);

    const newPost = {
      id: Date.now(),
      board: selectedBoard,
      prefix: finalPrefix,
      title,
      content: editorContent,
      tags: tagArr,
      date: new Date().toISOString().split('T')[0],
      writer: '테스트사용자',
      views: 0
    };

    onSubmit(newPost);

    // 폼 초기화
    setSelectedBoard('');
    setSelectedPrefix('');
    setSelectedSecondPrefix('');
    setTitle('');
    setEditorContent('');
    setTags('');
  };

  // 링크 삽입 핸들러 (유튜브, 비메오 자동 임베드 포함)
  const handleInsertLink = (url) => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection() || { index: editor.getLength(), length: 0 };

    if (range.length > 0) {
      editor.deleteText(range.index, range.length);
    }
    // 유튜브, 비메오 자동 임베드
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.includes('watch?v=')
        ? url.split('watch?v=')[1].split('&')[0]
        : url.split('youtu.be/')[1].split('?')[0];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const embedHtml = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
      editor.clipboard.dangerouslyPasteHTML(range.index, embedHtml);
    } else if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('vimeo.com/')[1].split(/[?/]/)[0];
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
      const embedHtml = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
      editor.clipboard.dangerouslyPasteHTML(range.index, embedHtml);
    } else {
      // 일반 링크
      editor.insertText(range.index, url, 'link', url);
      editor.setSelection(range.index + url.length, 0);
    }
  };

  return (
    <div className="cafe-write-container">
      {/* 헤더 */}
      <div className="header-bar">
        <div className="header-left">글쓰기</div>
        <div className="header-right">
          <button type="button" className="header-submit-btn" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
      <hr className="header-line" />

      {/* 폼 영역 */}
      <div className="cafe-write-form">
        {/* 상단 영역: 게시판, 말머리, 제목 */}
        <div className="top-area">
          <div className="board-prefix-wrap">
            <div className="input-group board-select">
              <label>게시판 선택</label>
              <select value={selectedBoard} onChange={handleBoardChange} required>
                <option value="">게시판을 선택해 주세요.</option>
                {boardList.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {selectedBoard === '공지사항' && (
              <div className="input-group prefix-select">
                <label>말머리 선택</label>
                <select
                  value={selectedPrefix}
                  onChange={(e) => setSelectedPrefix(e.target.value)}
                  required
                >
                  {prefixOptions['공지사항'].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBoard === '제안서' && (
              <>
                <div className="input-group prefix-input">
                  <label>1차 말머리</label>
                  <input type="text" value="[제안서]" readOnly />
                </div>
                <div className="input-group prefix-select">
                  <label>2차 말머리 (선택)</label>
                  <select
                    value={selectedSecondPrefix}
                    onChange={(e) => setSelectedSecondPrefix(e.target.value)}
                  >
                    {secondPrefixOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="title-box">
            <input
              type="text"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 커스텀 툴바 - 1차 도구와 2차 도구로 그룹화 */}
        <div id="custom-toolbar">
          {/* 1차 도구 (기본 인라인 스타일 및 링크 커스텀) */}
          <div className="toolbar-line file-tools">
            <span className="ql-formats">
              <select className="ql-font" defaultValue="notoSansKR">
                <option value="notoSansKR">기본서체</option>
                <option value="nanumGothic">나눔고딕</option>
                <option value="nanumMyeongjo">나눔명조</option>
                <option value="nanumSquare">나눔스퀘어</option>
              </select>
              <select className="ql-size" defaultValue="14px">
                <option value="10px">10pt</option>
                <option value="12px">12pt</option>
                <option value="14px">14pt</option>
                <option value="16px">16pt</option>
                <option value="18px">18pt</option>
                <option value="20px">20pt</option>
              </select>
              <select className="ql-header" defaultValue="">
                <option value="">본문</option>
                <option value="1">제목1</option>
                <option value="2">제목2</option>
              </select>
              <button className="ql-bold" />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-strike" />
              <button className="ql-link" />
            </span>
          </div>

          {/* 2차 도구 (본문 관련 추가 서식) */}
          <div className="toolbar-line text-tools">
            <span className="ql-formats">
              <button className="ql-blockquote" />
              <button className="ql-code-block" />
              <button className="ql-list" value="ordered" />
              <button className="ql-list" value="bullet" />
              <button className="ql-script" value="sub" />
              <button className="ql-script" value="super" />
              <button className="ql-indent" value="-1" />
              <button className="ql-indent" value="+1" />
              <select className="ql-direction" />
              <select className="ql-color" />
              <select className="ql-background" />
              <select className="ql-align" />
              <button className="ql-image" />
              <button className="ql-video" />
              <button className="ql-formula" />
              <button className="ql-clean" />
            </span>
          </div>
        </div>

        {/* 본문(ReactQuill) 영역 + 태그 영역 */}
        <div className="quill-wrap">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={editorContent}
            onChange={setEditorContent}
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요."
          />

          <div className="tag-area">
            <label>태그 (예: #태그1 #태그2)</label>
            <input
              type="text"
              placeholder="#태그 입력 (공백으로 구분)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Link Modal (링크 커스텀 유지) */}
      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onInsert={handleInsertLink}
      />
    </div>
  );
}

export default CafeWritePost;
