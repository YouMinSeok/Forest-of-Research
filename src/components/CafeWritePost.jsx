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

  // 첨부파일 목록
  const [attachments, setAttachments] = useState([]);

  // Quill ref
  const quillRef = useRef(null);

  // (1) 1차 도구: 이미지/동영상/첨부파일 (절대 수정 X)
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const attachInputRef = useRef(null);

  // Quill modules & formats (절대 수정 X)
  const modules = useMemo(() => ({
    toolbar: {
      container: '#custom-toolbar',
      handlers: {
        link: () => {
          setLinkModalOpen(true);
        }
      }
    }
  }), []);

  const formats = useMemo(
    () => [
      'header', 'font', 'size',
      'bold', 'underline', 'strike',
      'list', 'bullet', 'link', 'image', 'video'
    ],
    []
  );

  // 게시판/말머리 선택
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

  /**
   * 파일 업로드 (백엔드 연동 시 교체)
   */
  const uploadFile = async (file, type) => {
    // 테스트용 가짜 업로드
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/uploads/${file.name}`);
      }, 600);
    });
  };

  // ============= (1) 이미지 업로드 =============
  const handleImageSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFile(file, 'image');
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection() || { index: editor.getLength(), length: 0 };
      editor.insertEmbed(range.index, 'image', url);
      editor.setSelection(range.index + 1, 0);
    }
  };

  const handleImageUploadClick = () => {
    imageInputRef.current?.click();
  };

  // ============= (2) 동영상 업로드 =============
  const handleVideoSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFile(file, 'video');
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection() || { index: editor.getLength(), length: 0 };
      editor.insertEmbed(range.index, 'video', url);
      editor.setSelection(range.index + 1, 0);
    }
  };

  const handleVideoUploadClick = () => {
    videoInputRef.current?.click();
  };

  // ============= (3) 첨부파일 업로드 =============
  const handleAttachSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFile(file, 'attachment');

    const newAttachment = {
      name: file.name,
      url
    };
    setAttachments((prev) => [...prev, newAttachment]);
  };

  const handleAttachUploadClick = () => {
    attachInputRef.current?.click();
  };

  // 첨부파일 제거 (X 버튼)
  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  // 등록 버튼
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
      views: 0,
      attachments
    };

    onSubmit(newPost);

    // 폼 초기화
    setSelectedBoard('');
    setSelectedPrefix('');
    setSelectedSecondPrefix('');
    setTitle('');
    setEditorContent('');
    setTags('');
    setAttachments([]);
  };

  // 링크 삽입 (기존 로직)
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
      {/* 숨겨진 파일 입력 (이미지/동영상/첨부파일) */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: 'none' }}
        onChange={handleImageSelected}
      />
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        style={{ display: 'none' }}
        onChange={handleVideoSelected}
      />
      <input
        type="file"
        ref={attachInputRef}
        style={{ display: 'none' }}
        onChange={handleAttachSelected}
      />

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

        {/* 커스텀 툴바 (절대 수정 X) */}
        <div id="custom-toolbar">
          {/* (1) 1차 도구 - 이미지/동영상/첨부파일 */}
          <div className="toolbar-line file-tools">
            <span className="ql-formats tool-items-container">
              {/* 첫 번째: 이미지 */}
              <div className="tool-item">
                <button className="icon-btn" onClick={handleImageUploadClick}>
                  <i className="material-icons icon-img">image</i>
                  <div className="icon-label">이미지</div>
                </button>
              </div>

              {/* 두 번째: 동영상 */}
              <div className="tool-item">
                <button className="icon-btn" onClick={handleVideoUploadClick}>
                  <i className="material-icons icon-video">videocam</i>
                  <div className="icon-label">동영상</div>
                </button>
              </div>

              {/* 세 번째: 첨부파일 */}
              <div className="tool-item">
                <button className="icon-btn" onClick={handleAttachUploadClick}>
                  <i className="material-icons icon-video">attach_file</i>
                  <div className="icon-label">첨부파일</div>
                </button>
              </div>

              {/* (나중에 4번째, 5번째 버튼 추가 시 .tool-item 반복) */}
            </span>
          </div>

          <div className="toolbar-separator"></div>

          {/* (2) 2차 도구 - 본문도구 */}
          <div className="toolbar-line text-tools">
            <span className="ql-formats">
              <select className="ql-header" defaultValue="">
                <option value="">본문</option>
                <option value="1">제목1</option>
                <option value="2">제목2</option>
              </select>
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
              <button className="ql-bold">B</button>
              <button className="ql-underline">U</button>
              <button className="ql-strike">S</button>
              <button className="ql-link">Link</button>
              <button className="ql-list" value="ordered">1.</button>
              <button className="ql-list" value="bullet">•</button>
              <button className="ql-clean">X</button>
            </span>
          </div>
        </div>

        {/* 본문(ReactQuill) 영역 + 태그(본문과 함께) */}
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

        {/* 첨부파일 영역 (첨부파일이 1개 이상일 때만 표시) */}
        {attachments.length > 0 && (
          <div className="attachment-area">
            <hr
              style={{
                margin: '0 0 1rem 0',
                border: 'none',
                borderTop: '1px solid #ddd'
              }}
            />
            <label>첨부파일</label>
            <ul>
              {attachments.map((fileObj, idx) => (
                <li key={idx}>
                  {/* 파일명 */}
                  <div className="file-name">{fileObj.name}</div>

                  {/* 다운로드 버튼 */}
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = fileObj.url;
                      link.download = fileObj.name;
                      link.click();
                    }}
                  >
                    다운로드
                  </button>

                  {/* 미리보기 버튼 */}
                  <button onClick={() => window.open(fileObj.url, '_blank')}>
                    미리보기
                  </button>

                  {/* X (제거) 버튼 */}
                  <button
                    onClick={() => handleRemoveAttachment(idx)}
                    style={{ color: 'red' }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Link Modal (기존) */}
      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onInsert={handleInsertLink}
      />
    </div>
  );
}

export default CafeWritePost;
