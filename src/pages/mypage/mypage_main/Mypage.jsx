import React, {useCallback, useEffect, useState} from "react";
import './mypage.css';
import { Link, useParams } from 'react-router-dom';
import list_data from "./mypage_list_data.jsx";
import Header_center from "../../../components/header/Header_center.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import Modal_confirm from "../../../components/modal/Modal_confirm.jsx";
import member_info_data from "../../../data/member_info_data.jsx";
import axios from "axios";

function Mypage() {
    const { memberId } = useParams();

    // 임의로 설정한 memberId의 member 조회 -> 나중에 삭제
    const member = member_info_data.find(m => m.memberId === parseInt(memberId, 10));

//    const [member, setMember] = useState(null); //  member 데이터 관리 -> 백엔드랑 연결 시 주석 해제
    let [list] = useState(list_data);   // 마이페이지 목록 (작성 글 조회, 정보 수정 등)
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 네/아니오 모달창 띄우기
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const iconStyle = { fontSize: "27px" };

    // 회원 정보를 조회하는 API 호출
//    useEffect(() => {
//        axios.get(`/members/${memberId}`)
//            .then(response => {
//                setMember(response.data);
//            })
//            .catch(error => {
//                console.error('Error fetching member data:', error);
//            });
//    }, [memberId]);

    const handleOpenModal = useCallback((message) => {
        setModalMessage(message);
        setShowDeleteModal(true);
    }, []);

    const handleCloseModal = () => setShowDeleteModal(false);

    return (
        <div className="Mypage">
            <Header_center />
            {member && (
                <div className="propyl">
                    <div className="title">
                        <p>내 프로필</p>
                        <button onClick={() => handleOpenModal("로그아웃 하시겠습니까?")}>로그아웃</button>
                    </div>
                    <img
                        src={member.img}
                        alt="Profile"
                    />
                    <div className="info">
                        <p style={{ paddingTop: "5px", fontSize: "18px" }}>{member.name}</p>
                        <p style={{ fontSize: "15px", marginLeft: "2px" }}>{member.studentNum}</p>
                    </div>
                </div>
            )}
            <div className="menu_list">
                {
                    list.map((a, i) => {
                        if (a.isDelete) {
                            return (
                                <div className="mypage_list" key={i}>
                                    <div className="link" onClick={() => handleOpenModal(a.message)}>
                                        <div style={iconStyle} className="icon">{a.icon}</div>
                                        <p>{a.name}</p>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <List
                                    key={i}
                                    name={a.name}
                                    icon={a.icon}
                                    link={a.link.replace(":memberId", memberId)}
                                    iconStyle={iconStyle}
                                />
                            )
                        }
                    })
                }
            </div>
            <Footer />
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} link="/" />}
        </div>
    );
}

function List({ name, icon, link, iconStyle }) {
    return (
        <div className="mypage_list">
            <Link to={link} className="link">
                <div style={iconStyle} className="icon">{icon}</div>
                <p>{name}</p>
            </Link>
        </div>
    );
}

export default Mypage;