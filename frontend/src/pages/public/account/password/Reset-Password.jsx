import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import styles from '../../../../assets/css/account/Register&Login.module.css';
import { useCsrfToken } from "../../../../component/middleware/Csrf-token";

const ResetPassword = () => {

    const [params] = useSearchParams();
    const reference = params.get('reference');
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useCsrfToken();

    // check if the reference ID is pending on render and fetch email address
    const [email, setEmail] = useState(null);
    const checkStatus = async () => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}fetch/otp-verification-status.php?reference=${reference}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const request = await response.json();
            if (!response.ok || request.status === 'error') {
                toast.error(request.message || `Server responded with status ${response.status}`);
                navigate('/account/login');
                setEmail(null);
            }

            else {
                setEmail(request.data);
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
            setEmail(null);
        }
    }

    useEffect(() => {
        if (!reference || reference === '') {
            toast.error('Access denied', {toastId: 'reference null'});
            navigate('/account/login');
        }
        checkStatus();
        document.title = `Reset Password - ${import.meta.env.VITE_APP_NAME}`;
        refreshCsrfToken();
    }, [])

    const [formData, setFormData] = useState({
        new_password: '',
        verification_code: ''
    })

    const handleOtpInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}account/reset-completion.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ 
                    new_password: formData.new_password, 
                    verification_code: formData.verification_code,
                    reference: reference,
                    email: email
                })
            })

            const request = await response.json();
            if (request.status === 'success') {
                toast.success("Password has been changed successfully", {toastId: 'success'});
                navigate('/account/login');
            }

            else {
                toast.warning(request.message || 'Something went wrong', {toastId: 'something-error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }

    // for hide button
    const [password, setPassword] = useState(false);
    const togglePassword = () => {
        setPassword(!password);
    }

    return (
        <>
            <div className={styles['register-login']}>
                <form action="" method='POST' onSubmit={handleOtpSubmit}>
                    {/* header intro */}
                    <div className={styles['header-intro']}>
                        <p>Reset Password</p>
                        <p>We've sent a verification code to <span style={{ color: 'darkcyan' }}>{email ? email.slice(0, 3) + '****@' + email.split('@')[1]: ''}</span></p>
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="otp">Enter Verification Code <span className='text-danger'>*</span></label>
                        <input type="number" onChange={handleOtpInput} name="verification_code" className='form-control' id="code" />
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="password">Enter New Password <span className='text-danger'>*</span></label>
                        <div className="input-group">
                            <input type={password ? 'text': 'password'} onChange={handleOtpInput} name="new_password" className='form-control' id="new_password" />
                            <button type="button" onClick={togglePassword} className={`btn btn-normal border ${password ? 'bi-eye-slash': 'bi-eye'}`}></button>
                        </div>
                    </div>

                    <div className={styles['form_group']}>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ResetPassword;