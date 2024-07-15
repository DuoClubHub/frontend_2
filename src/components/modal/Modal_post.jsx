import React, {useCallback, useState} from "react";
import './modal_post.css';
import Modal_confirm from "./Modal_confirm.jsx";
import {useNavigate} from "react-router-dom";

const Modal_post = ({onClose, onEdit}) => {
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 네/아니오 모달창 띄우기
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const handleOpenModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowDeleteModal(true);
    }, []);

    const handleCloseModal = () => setShowDeleteModal(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleEdit = () => {
        onEdit();
        onClose();
    };

    return (
        <div className="Modal_post" onClick={handleOverlayClick}>
            <div className="modal_post_content" onClick={(e) => e.stopPropagation()}>
                <button className="post_delete" onClick={() => handleOpenModal("글을 삭제하시겠습니까?", () => {navigate(-1)})}>글 삭제하기</button>
                <button onClick={handleEdit}>글 수정하기</button>
            </div>
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    );
};

export default Modal_post;