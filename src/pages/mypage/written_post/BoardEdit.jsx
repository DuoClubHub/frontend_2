import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../myclub/DetailHeader/myclubheader.css'
import '../../myclub/notice/WriteAndEdit/noticewrite.css';
import { useNavigate, useParams } from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

function BoardEdit() {
    let { postId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);  // 이미지 파일 상태
    const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태 추가

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                // 게시글 정보 가져오기
                const response = await apiClient.get(`/postdetail/${postId}`);
                const post = response.data;
                console.log('Fetched post data:', response.data);
                setTitle(post.title);
                setContent(post.content);
            } catch (error) {
                console.error('게시글 정보 가져오는 중 오류 발생:', error);
                alert('게시글 정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchPostData();
    }, [postId]);

    // 제목 입력
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 내용 입력
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        const fileUrls = files.map(file => URL.createObjectURL(file));
        setAttachmentNames(fileUrls);

        console.log('Selected files:', files);
        console.log('Attachment URLs:', fileUrls);
    };

    // 글쓰기 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const attachmentFlag = attachmentNames.length > 0 ? 'Y' : 'N';
            console.log('Attachment flag:', attachmentFlag);

            const response = await apiClient.put(`/posts/${postId}`, {
                postId,
                title,
                content,
                attachment_flag: attachmentFlag,
                attachment_names: attachmentNames
            });

            if (response.status === 200 || response.status === 201) {
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
            alert('글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalConfirm = () => {
        navigate(-1);
    };

    return (
        <div>
            <div className="header_container">
                <FiX
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                    onClick={handleBackClick}
                />
                <div style={{ fontSize: '19px', fontWeight: "bold" }}>글 수정</div>
                <FiCheck
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                    onClick={handleSubmit}
                />
            </div>
            <div className='write_container'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="notice_title"
                        placeholder="제목"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <textarea
                        className="notice_content"
                        placeholder="내용을 입력하세요."
                        rows={10}
                        value={content}
                        onChange={handleContentChange}
                    ></textarea>
                    <div
                        style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#414141" }}>
                        <label>
                            <LuImagePlus style={{ fontSize: '30px', cursor: 'pointer', marginLeft: "10px" }} />
                            <input
                                type="file"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </label>
                        <div style={{ marginLeft: "10px" }}>첨부할 사진을 선택하세요.</div>
                    </div>
                </form>
                <div id="uploaded-images">
                    {attachmentNames.map((url, index) => (
                        <img key={index} src={url} alt={`uploaded ${index}`}
                             style={{ width: '100px', height: '100px', margin: '10px' }} />
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <Modal_ok
                    message="수정이 완료되었습니다."
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}
        </div>
    )
}

export default BoardEdit;