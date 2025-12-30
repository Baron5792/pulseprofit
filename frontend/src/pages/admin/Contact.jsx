import DashboardOverview from "../../component/admin/DasboardOverview";
import css from '../../assets/css/admin/Dashboard.module.css';
import styles from "../../assets/css/admin/Contact.module.css";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const ContactUs = () => {

    // fetch messages from the backend api and display here
    const [data, setData] = useState(null);
    const fetchMessages = useCallback(async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/fetch/contact_messages.php`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setData(request.data);
            }

            else {
                toast.error(request.message || "Something went wrong", {toastId: 'something-error'});
                setData(null);
            }
        }

        catch (error) {
            toast.error(error.message || 'Something went wrong', {toastId: 'something-error'});
            setData(null);
        }
    }, [])

    useEffect(() => {
        document.title = `Admin Contact Us - ${import.meta.env.VITE_APP_NAME}`;
        fetchMessages();
    }, [fetchMessages])

    // view messages
    const [messageModal, setMessageModal] = useState(false);
    const [messageData, setMessageData] = useState(null);
    const viewMssage = async(messageId) => {
        setMessageModal(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/fetch/single_contact_message.php?id=${messageId}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setMessageData(request.data);
                setMessageModal(true);
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                setMessageData(null);
                setMessageModal(false);
            }
        }

        catch (error) {
            toast.error(error.message || 'Something went wrong', {toastId: 'network-error'});
            setMessageData(null);
            setMessageModal(false);
        }
    }

    const closeMessageModal = () => {
        setMessageData(null);
        setMessageModal(false);
    }

    // for replying messages
    // modal for replying messages
    const [replyModal, setReplyModal] = useState(false);
    const [replyMessageId, setReplyMessageId] = useState(null);
    const replyMessage = async(messageId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/fetch/single_contact_message.php?id=${messageId}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setReplyModal(true);
                setReplyMessageId(request.data);
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                setReplyMessageId(null);
                setReplyModal(false);
            }
        }

        catch (error) {
            toast.error(error.message || "Something went wrong", {toastId: 'something-error'})
        }
    }
    
    const closeReplyModal = () => {
        setReplyModal(false);
        setReplyMessageId(null);
    }

    // for sending a rely to a user
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    })

    const handleInput = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const [submitBtn, setSubmitBtn] = useState(false);
    const handleReplyMessage = async(event, messageId) => {
        event.preventDefault();
        const swalAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'Cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed'
        })

        if (swalAlert.isConfirmed) {
            try {
                setSubmitBtn(true);
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/update/reply_contact_messages.php`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messageId: messageId,
                        subject: formData.subject,
                        message: formData.message
                    })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    toast.info('Reply sent successfully', {toastId: 'success'});
                    setReplyModal(false);
                    fetchMessages();
                }

                else {
                    setTimeout(() => {
                        toast.error(request.message || "Something went wrong", {toastId: 'error'});
                        setSubmitBtn(false);
                    }, 2000)
                }
            }

            catch (error) {
                setTimeout(() => {
                    toast.error(error.message || 'Something went wrong', {toastId: 'network-error'});
                    setSubmitBtn(false);
                }, 2000)
            }
        }
    }

    return (
        <>
            <div className={css['page_title']}>
                <p>Contact Us</p>
            </div>

            <DashboardOverview />

            <div className={styles['contact_container']}>
                <table className={styles['contact_table']}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Email <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Subject <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Message <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Status <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Date <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}.</td>
                                    <td style={{ wordWrap: 'break-word' }}>{item?.fullname}</td>
                                    <td>{item?.email}</td>
                                    <td>{item?.subject}</td>
                                    <td>{item.message && item.message.length > 15 ? item.message.slice(0, 15) + '...': item.message}  <button onClick={() => viewMssage(item.id)} type="button" className="bi bi-eye small p-0 btn btn-normal"></button></td>
                                    <td>{item?.status}</td>
                                    <td>{new Date(item?.date).toLocaleDateString()}</td>
                                    {item.status === 'PENDING' ? (
                                        <td>
                                            <button type="button" onClick={() => replyMessage(item.id)} className="bi bi-reply btn btn-normal p-0"></button>
                                        </td>
                                    ): (
                                        <td>
                                            <span className="text-success">Replied</span>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan={8}>No messages found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>



            {/* message modal */}
            {messageData && (
                <Modal show={messageModal}>
                    <div className="p-4">
                        <div className="d-flex justify-content-between">
                            <p className="fs-5">From: {messageData.fullname}</p>
                            <button type="button" onClick={closeMessageModal} className="btn btn-normal bi bi-x"></button>
                        </div>
                        <div className="text-center my-4">
                            <p style={{ fontFamily: "sans-serif", fontWeight: 'lighter', fontSize: '20px' }}>{messageData.subject}</p>
                        </div>
                        <div className="my-3">
                            <span style={{ wordWrap: 'break-word' }}>{messageData.message}</span>
                        </div>
                    </div>
                </Modal>
            )}


            {/* modal for replying messages */}
            {replyMessageId && (
                <Modal show={replyModal}>
                    <div className="p-4">
                        <div className="d-flex justify-content-between">
                            <p className="fs-5">Reply: {replyMessageId.fullname}</p>
                            <button type="button" className="btn btn-normal bi bi-x" onClick={closeReplyModal}></button>
                        </div>

                        <form onSubmit={(event) => handleReplyMessage(event, replyMessageId.id)}>
                            <div className="form-group mt-4">
                                <label htmlFor="subject" className="small fw-bold text-secondary">Subject <span className="text-danger">*</span></label>
                                <input type="text" onChange={handleInput} name="subject" className="form-control" />
                            </div>

                            <div className="form-group mt-4">
                                <label htmlFor="subject" className="small fw-bold text-secondary">Message <span className="text-danger">*</span></label>
                                <textarea name="message" onChange={handleInput} className="form-control" id=""></textarea>
                            </div>

                            <div className="mt-4">
                                <button disabled={submitBtn} type="submit" className="btn btn-primary form-control">{submitBtn ? 'Sending...': 'Send Reply'}</button>
                            </div>  
                        </form>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default ContactUs