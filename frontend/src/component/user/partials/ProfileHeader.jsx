import { useState } from 'react';
import styles from '../../../assets/css/user/ProfileHeader.module.css';
import unknownImg from '../../../assets/images/avatar/unknown.jpeg';
import { useUser } from '../../middleware/Authentication';
import { Modal } from 'react-bootstrap';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router';

export const ProfileHeader = () => {
    const { user, refreshUser } = useUser();
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const handleModal = () => {
        setOpenModal(true);
    }

    const closeModal = () => {
        setOpenModal(false);
        setSelectedFileName(null); 
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name); 
            setSelectedFile(file);
        } else {
            setSelectedFileName(null);
        }
    };

    const [submitBtn, setSubmitBtn] = useState(false);
    const submitAvatar = async(event) => {
        event.preventDefault();
        setSubmitBtn(true);

        if (!selectedFileName) {
            toast.warning('Please select an image to proceed', {toastId: 'no-avatar'});
            setTimeout(() => {
                setSubmitBtn(false);
            }, 2000)
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}upload/avatar.php`, {
                body: formData,
                credentials: 'include',
                method: 'POST'
            })    
            
            const data = await response.json();
            if (data.status === 'success') {
                setTimeout(() => {
                    setOpenModal(false);
                    toast.success('Avatar has been upload successfully', {toastId: 'success'});
                    setSelectedFileName(null);
                    setSubmitBtn(false);
                }, 1000);
            }

            else {
                setTimeout(() => {
                    toast.error(data.message || "An error occured while uploading avatar", {toastId: 'something-error'});
                    setSubmitBtn(false);
                }, 2000)
            }
        }

        catch (error) {
            setTimeout(() => {
                toast.error('Something went wrong', {toastId: 'network-error'});
                setSubmitBtn(false);
            }, 2000)
        }
    }


    // delete avatar
    const deleteAvatar = async() => {
        try {
            const deleteResponse = await fetch (`${import.meta.env.VITE_APP_API_URL}upload/delete-avatar.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const deleteRequest = await deleteResponse.json();
            if (deleteRequest.status === 'success') {
                toast.success('Avatar has been deleted successfully');
            }
            else {
                toast.error('An error occured' || deleteRequest.message);
            }
        }

        catch (error) {
            toast.error('Network error');
        }
    }


    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshUser(); 
        }, 5000); 

        return () => {
            clearInterval(intervalId);
        };

    }, []);

    return (
        <>
            <div className={`${styles['access_control']}`}>
                <p><span className='bi bi-info-circle text-info'></span> You have full control to manage your own account setting.</p>
            </div>

            {/* users avatar */}
            <div className={styles['user_avatar']}>
                {user && user.avatar && user.avatar.length > 1 ? (
                    <img src={import.meta.env.VITE_APP_AVATAR + user.avatar} alt="__blank" />
                ): (
                    <img src={unknownImg} alt="__blank" />
                )}


                {/* image buttons */}
                <div className={styles['avatar_btn']}>
                    {user && user.avatar && user.avatar.length > 1 ? (
                        <>
                            <button type="button" onClick={deleteAvatar} className='btn btn-danger text-white'>
                                <span className='bi bi-trash'></span>
                            </button>
                        </>
                    ): (
                        <button type="button" onClick={handleModal} className='btn btn-info text-white'>
                            <span className='bi bi-cloud-upload'></span>
                        </button>
                    )}
                </div>
            </div>



            {/* settings links */}
            <div className={styles['nav_links']}>
                <NavLink to={'/user/profile'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>Profile</NavLink>

                {/* <NavLink to={'/user/profile/verification'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>Verification</NavLink> */}

                <NavLink to={'/user/profile/security'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>Security</NavLink>

                <NavLink to={'/user/profile/activity'} end className={({ isActive }) => isActive ? `${styles['isActive']}`: `${styles['notActive']}`}>Activity</NavLink>
            </div>



            {/* modal for avatar */}
            <Modal show={openModal} className=''>
                <Modal.Title>
                    <div className={`${styles['modal_title']}`}>
                        <p>Update avatar</p>
                        <button onClick={closeModal} type="button" className='btn btn-normal bi bi-x fs-4'></button>
                    </div>
                </Modal.Title>
                <Modal.Body>
                    <form onSubmit={submitAvatar} method="post" encType='multipart/form-data'>
                        <div className={styles['modal_body']}>
                            <label htmlFor="avatar">
                                Click to select an avatar
                                {/* 4. Display the selected file name */}
                                {selectedFileName && (
                                    <span className="ms-2 badge bg-primary">{selectedFileName}</span>
                                )}
                            </label>
                            
                            {/* 2. Add the onChange handler to the input */}
                            <input 
                                type="file"           
                                name="avatar" 
                                id="avatar" 
                                onChange={handleFileChange}
                            /> 
                        </div>
                        <div className={styles['modal_footer']}>
                            <button type="submit" disabled={!selectedFileName} className='btn btn-primary form-control'>
                                {submitBtn ? (
                                    <span className='spinner spinner-border spinner-border-sm'></span>
                                ): (
                                    <span className='bi bi-cloud-upload'></span>
                                )}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}