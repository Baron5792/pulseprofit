import styles from '../../../../assets/css/user/EveryProfile.module.css';
import { Modal } from 'react-bootstrap';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../../../../component/middleware/Authentication';
import { toast } from 'react-toastify';
import { useCsrfToken } from '../../../../component/middleware/Csrf-token';

const Security = () => {
    const { user, refreshUser } = useUser();
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const [showEmailModal, setShowEmailModal] = useState(false);
    const openEmailModal = () => {
        setShowEmailModal(true);
    }

    const closeEmailModal = () => {
        setShowEmailModal(false);
    }

    const [otpInput, setOtpInput] = useState(false);
    const [emailData, setEmailData] = useState({
        current_email: null,
        new_email: '',
        confirm_email: '',
    });

    const handleEmailInput = (e) => {
        const { name, value } = e.target;
        setEmailData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const requiredFields = ['new_email', 'confirm_email'];  
    const [processBtn, setProcessBtn] = useState(false);
    const [resendBtn, setResendBtn] = useState(true);
    const changeEmail = async(event) => {
        event.preventDefault();
        setProcessBtn(true);
        for (let field of requiredFields) {
            if (!emailData[field]) {
                toast.warning('Please fill in all required fields.', {toastId: 'empty-field'});
                setTimeout(() => {
                    setProcessBtn(false);
                }, 2000)
                return;
            }
        }

        if (emailData.new_email !== emailData.confirm_email) {
            toast.warning('Emails do not match. Please check and try again.', {toastId: 'not match'});
            setTimeout(() => {
                setProcessBtn(false);
            }, 2000)
            return;
        }

        if (emailData.new_email === emailData.current_email) {
            toast.warning('Current email cannot be used again', {toastId: 'email conflict'});
            setTimeout(() => {
                setProcessBtn(false);
            }, 2000)
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}insert/send_change_email_otp.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(emailData)
            })

            const request = await response.json();
            if (request.status === 'success') {
                setTimeout(() => {
                    toast.info('A confirmation code has been sent to your new email. Please enter the code', {toastId: 'success'});
                    setOtpInput(true);
                    setProcessBtn(false);
                }, 2000)
                const interval = setInterval(() => {
                    setResendBtn(false);
                }, 60000)

                return () => clearInterval(interval);
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'error'});
                setProcessBtn(false);
            }
        }

        catch (error) {
            toast.error('Something went wrong. Please try again later.', {toastId: 'change-email-error'});
            setProcessBtn(false);
        }
    }

    useEffect(() => {
        refreshUser();
        document.title = `Security - ${import.meta.env.VITE_APP_NAME}`;
        refreshCsrfToken();
        if (user && user.email && user.email !== emailData.current_email) {
            setEmailData(prev => ({
                ...prev,
                current_email: user.email
            }))
        }
    }, [])

    const [changeModal, setChangeModal] = useState(false);
    const openChangeModal = () => {
        setChangeModal(true);
    }

    const closeChangeModal = () => {
        setChangeModal(false);
    }

    const [changeInput, setChangeInput] = useState({
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    })

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setChangeInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const changePassword = async(event) => {
        event.preventDefault();
        const isEmpty = Object.values(changeInput).some(value => value.trim() === '')
        if (isEmpty) {
            toast.warning('All fields are required to proceed!', {toastId: 'required'});
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}update/change_password.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(changeInput)
            })

            const request  = await response.json();
            if (request.status === 'success') {
                toast.success('Your password has been changed successfully', {toastId: 'success'});
                setChangeModal(false);
                setChangeInput({
                    current_password: '',
                    new_password: '',
                    confirm_new_password: ''
                })
            }

            else {
                toast.warning(request.message || 'Something went wrong', {toastId: 'something-error'});
            }
        }

        catch (error) {
            toast.error(error.message || 'Something went wrong!', {toastId: 'network-error'});
        }
    }
    
    return (
        <>
            {/* profile top */}
            <div className={`${styles['profile_top']}`}>
                <p>Settings</p>
                <p>These settings are required to keep your account secure..</p>
            </div>

            <div className={`${styles['profile_main_container']}`}>
                {/* change email address */}
                <div className={`${styles['security_container']}`}>
                    <div className={styles['security_title']}>
                        <p>Change Email Address</p>
                        <p>Update the email address associated with your account.</p>
                    </div>
                    <div className={styles['security_options']}>
                        <button onClick={openEmailModal} className={`${styles['security_button']}`}>Change Email</button>
                    </div>
                </div>

                {/* change password */}
                <div className={`${styles['security_container']}`}>
                    <div className={styles['security_title']}>
                        <p>Change Password</p>
                        <p>Set a unique password to protect your account.</p>
                    </div>
                    <div className={styles['security_options']}>
                        <button onClick={openChangeModal} className={`${styles['security_button']}`}>Change Password</button>
                    </div>
                </div>


                {/* update kyc verification */}
                <div className={`${styles['security_container']}`}>
                    <div className={styles['security_title']}>
                        <p>KYC Verification</p>
                        <p>Verify your identity to unlock higher limits and secure your account.</p>
                    </div>
                    <div className={styles['security_options']}>
                        <button className={`${styles['security_button']}`}>Verify Now</button>
                    </div>
                </div>
            </div>

            



            {/* Modal for changing email address */}
            <Modal show={showEmailModal}>
                <form onSubmit={changeEmail} className={styles['modal_body']}>
                    <Modal.Title>
                        <div className={styles['modal_header']}>
                            <p>Change Email Address</p>
                            <button type="button" className='btn btn-normal bi bi-x' onClick={closeEmailModal}></button>
                        </div>
                    </Modal.Title>

                    {/* modal body */}
                    <div className={styles['modal_form_data']}>
                        <div className={`${styles['modal_input']} form-group`}>
                            <label htmlFor="">Current Email Address</label>
                            <input type="email" name='current_email' onChange={handleEmailInput} value={user?.email} className='form-control' readOnly />
                        </div>

                        {/* new email address */}
                        <div className={`${styles['modal_input']} form-group`}>
                            <label htmlFor="">New Email Address <span className='text-danger'>*</span></label>
                            <input type="email" onChange={handleEmailInput} name='new_email' className='form-control' />
                        </div>

                        {/* confirm new email address */}
                        <div className={`${styles['modal_input']} form-group`}>
                            <label htmlFor="">Confirm New Email Address <span className='text-danger'>*</span></label>
                            <input type="email" onChange={handleEmailInput} name='confirm_email' className='form-control' />
                        </div>

                        {otpInput ? (
                            // enter OTP here
                            <button type='button' onClick={changeEmail} disabled={resendBtn} className='btn btn-danger mt-3 btn-sm'>{
                                resendBtn ? (
                                    'Processing'
                                ): (
                                    'Resend Code'
                                )
                            }</button>
                        ): (
                            <div className={`${styles['modal_button']} form-group`}>
                                <button disabled={processBtn} type="submit">{
                                    processBtn ? (
                                        <span className='spinner spinner-border spinner-border-sm'></span>
                                    ): (
                                        'Change Email'
                                    )
                                }</button>
                            </div>
                        )}

                        {otpInput ? (
                            null

                        ): (
                            <span className='small text-danger'><i className='bi bi-info-circle small'></i> A verification link will be sent to your new email address.</span>
                        )}
                            
                    </div>
                </form>

                <form action="" style={{ padding: '0px 20px 30px 20px' }}>
                    {otpInput ? (
                        <>
                            <div className={`${styles['modal_input']} form-group`}>
                                <label htmlFor="otp">Enter OTP <span className='text-danger'>*</span></label>
                                <input type="number" placeholder='Enter OTP to compelete the process' name='otp_verification' className='form-control' />
                            </div>

                            <div className={`${styles['modal_button']} form-group`}>
                                <button type="button">Verify</button>
                            </div>
                        </>
                    ): (
                        null
                    )}
                </form>
            </Modal>




            {/* for a change password */}
            <Modal show={changeModal}>
                <form onSubmit={changePassword} className={styles['modal_body']}>
                    <Modal.Title>
                        <div className={styles['modal_header']}>
                            <p>Change Password</p>
                            <button type="button" className='btn btn-normal bi bi-x' onClick={closeChangeModal}></button>
                        </div>
                    </Modal.Title>
                    <div className={styles['modal_form_data']}>
                        <div className={`${styles['modal_input']} form-group`}>
                            <label htmlFor="current_password">Current Password <span className='text-danger'>*</span></label>
                            <input type="password" name='current_password' onChange={handleChangeInput} className='form-control' />
                        </div>
                        <div className={`${styles['modal_input']} form-group`}>
                            <label htmlFor="new_password">New Password <span className='text-danger'>*</span></label>
                            <input type="password" name='new_password' onChange={handleChangeInput} className='form-control' />
                        </div>
                        <div className={`${styles['modal_input']} form-group`}>
                            <label htmlFor="confirm_new_password">Confirm New Password <span className='text-danger'>*</span></label>
                            <input type="password" name='confirm_new_password' onChange={handleChangeInput} className='form-control' />
                        </div>
                        <div className={`${styles['modal_button']} form-group`}>
                            <button type="submit">Change Password</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default Security;