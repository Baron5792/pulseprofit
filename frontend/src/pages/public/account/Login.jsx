import { NavLink } from 'react-router';
import styles from '../../../assets/css/account/Register&Login.module.css';
import GoogleTranslateCustom from '../../../component/public/Translator';
import { useCsrfToken } from '../../../component/middleware/Csrf-token';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Logo from '../../../assets/images/logo/image.png';
import Swal from 'sweetalert2'

export const PublicLogin = () => {
     // for password show and hide
    const [password, setPassword] = useState(false);
    const togglePassword = () => {
        setPassword(!password);
    }

    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Login - ${import.meta.env.VITE_APP_NAME}`;
    })

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const [submit, setSubmit] = useState(false);
    const handleLogin = async(event) => {
        setSubmit(true);
        event.preventDefault();
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}account/login.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify(formData)
            })

            const request = await response.json();
            if (request.status === 'success') {
                window.location.href = '/user/dashboard';
            }

            else {
                refreshCsrfToken();
                setTimeout(() => {
                    toast.error(request.message || "Something went wrong", {toastId: 'login_error'});
                    setFormData(prev => ({
                        ...prev,
                        password: ''
                    }))
                    setSubmit(false);
                }, 2000);
            }
        }

        catch (error) {
            refreshCsrfToken();
            setTimeout(() => {
                toast.error("Something went wrong", {toastId: 'login_network_error'});
                setSubmit(false);
            }, 2000)
        }
    }


    // forgot password modal
    const [modal, setModal] = useState(false);
    const openForgotModal = (event) => {
        event.preventDefault();
        setModal(true);
    }

    const closeModal = async() => {
        const swalAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Yes, continue',
        })

        if (swalAlert.isConfirmed) {
            setModal(false);
        }
    }

    // handle sending OTP to backend
    const [otpInput, setOtpInput] = useState({
        emailOrUsername: ''
    })

    const handleOtpInput = (e) => {
        const { name, value } = e.target;
        setOtpInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSendingOtpForm = async(event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}account/send-reset-code.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify(otpInput)
            })

            const request = await response.json();
            if (request.status === 'success') {
                navigate(`/account/password/reset-password?reference=${request.data}`);
                toast.success('An OTP has been successfully sent to your email.')
            }

            else {
                toast.warning(request.message || 'Something went wrong!', {toastId: 'something-error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }


    useEffect(() => {
        refreshCsrfToken();
    }, [])

    return (
        <>
            <div className={styles['register-login']}>
                <form action="" method='POST' onSubmit={handleLogin}>
                    {/* header intro */}
                    <div className={styles['header-intro']}>
                        <p>Login into Account</p>
                        <p>Sign in into your account using your email and passcode.</p>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="email">Email Address <span className='text-danger'>*</span></label>
                        <input type="email" disabled={submit} value={formData.email} onChange={handleInput} name="email" className='form-control' id="email" />
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="password">Password <span className='text-danger'>*</span></label>
                        <div className={`${styles['email-group']} input-group`}>
                            <input disabled={submit} value={formData.password} type={password ? "text" : "password"} onChange={handleInput} name="password" className='form-control' id="password" />

                            <button type="button" onClick={togglePassword} className={`btn btn-normal ${password ? 'bi bi-eye-slash': 'bi bi-eye'}`}></button>
                        </div>
                    </div>

                    {/* remeber me and forgot password */}
                    <div className="d-flex justify-content-between py-2">
                        <div className='form-group'>
                            <input type="checkbox" name="remember" id="remember" />
                            <label htmlFor="remember" className='small mx-2'>Remember me</label>
                        </div>

                        <div className={`${styles['forgot_code']} form-group`}>
                            <NavLink onClick={openForgotModal} to={'/account/forgot_password'} className='small'>Forgot Password?</NavLink>
                        </div>
                    </div>

                    <div className="form-group my-3">
                        <button type="submit" disabled={submit} className='btn btn-primary btn-md w-100'>{
                            submit ? 'Processing...' : 'Login'    
                        }</button>
                    </div>
                </form>
                {/* register footer */}
                <div className={styles['register-footer']}>
                    <p>New on our platform? <NavLink to={'/account/register'}>Create an account</NavLink></p>
                    <div>
                        <GoogleTranslateCustom />
                    </div>
                </div>
                
            </div>

            {/* modal here */}
            <Modal show={modal}>
                <Modal.Title>
                    <div className={styles['modal_title']}>
                        <img src={Logo} alt="__blank" />
                    </div>
                </Modal.Title>
                <Modal.Body>
                    <form action="" onSubmit={handleSendingOtpForm}>
                        <div className={styles['modal_body']}>
                            <div className={styles['content_title']}>
                                <p><span>-</span> Reset Account Password</p>
                            </div>
                            <div className={styles['content_description']}>
                                <p>If you've forgotten your password, then we'll email you instructions to reset your password.</p>
                            </div>

                            {/* for input */}
                            <div className={styles['form_group']}>
                                <label htmlFor="username or email">Enter your Email Address<span className='text-danger'>*</span></label>
                                <input type="text" name="emailOrUsername" onChange={handleOtpInput} placeholder='Enter your username or email' className='form-control' id="usernameOrpassword" />
                            </div>

                            <div className={styles['form_group']}>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}