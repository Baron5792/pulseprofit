import { NavLink } from 'react-router';
import styles from '../../../assets/css/account/Register&Login.module.css';
import GoogleTranslateCustom from '../../../component/public/Translator';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useCsrfToken } from '../../../component/middleware/Csrf-token';
import { useSearchParams } from 'react-router-dom';

const PublicRegister = () => {
    // for password show and hide
    const [password, setPassword] = useState(false);
    const togglePassword = () => {
        setPassword(!password);
    }

    const { csrfToken, refreshCsrfToken } = useCsrfToken(); // fetch CSRF token from context

    // for referral id
    const [searchParam] = useSearchParams();
    const referralId = searchParam.get('referralid');

    useEffect(() => {
        document.title = `Register - ${import.meta.env.VITE_APP_NAME}`;
        // refresh token on every render
        refreshCsrfToken();
    }, []);
    
    const [input, setInput] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        referralId: referralId || ''
    })

    const requiredFields = ['fullName', 'email', 'password'];

    const handleInput = (event) => {
        const { name, value } = event.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const [registerBtn, setRegisterBtn] = useState(false);
    const handleNewUser = async(event) => {
        event.preventDefault();
        setRegisterBtn(true);
        const isEmpty = requiredFields.some(value => input[value].trim() === '');
        if (isEmpty) {
            toast.warning("All fields are required to proceed", {toastId: 'registration_form_warning'});
            setTimeout(() => {
                setRegisterBtn(false);
            }, 2000)
            return;
        }
        
        // write a fetch API code
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}account/register.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken // token sent in header
                },
                body: JSON.stringify(input)
            });

            const data = await response.json();
            if (data.status === 'success') {
                toast.success(data.message || "Registration successful");
                const interval = setInterval(() => {
                    window.location.href = '/account/login';
                }, 3000);

                return () => clearInterval(interval);
            }

            else {
                setTimeout(() => {
                    setRegisterBtn(false);
                }, 2000)
                toast.error(data.message || "Registration failed", {toastId: 'registration_error'});
                // refresh token on error
                refreshCsrfToken();
            }
        }

        catch (error) {
            setTimeout(() => {
                setRegisterBtn(false);
            }, 2000)
            toast.error(error.message);
            // refresh token on error
            refreshCsrfToken();
        }
    }

    return (
        <>
            <div className={styles['register-login']}>   
                <form action="" method='POST' onSubmit={handleNewUser}>
                    {/* header intro */}
                    <div className={styles['header-intro']}>
                        <p>Create an Account</p>
                        <p>Sign up with your email and get started with your free account.</p>
                    </div>

                    {/* form here */}
                    <div className={styles['form-group']}>
                        <label htmlFor="fullName">Full Name <span className='text-danger'>*</span></label>
                        <input type="text" onChange={handleInput} name="fullName" className='form-control' id="fullName" />
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="username">Username <span className='text-danger'>*</span></label>
                        <input type="text" onChange={handleInput} name="username" className='form-control' id="username" />
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="email">Email Address <span className='text-danger'>*</span></label>
                        <input type="email" onChange={handleInput} name="email" className='form-control' id="email" />
                    </div>

                    <div className={styles['form-group']}>  
                        <label htmlFor="password">Password <span className='text-danger'>*</span></label>
                        <div className={`${styles['email-group']} input-group`}>
                            <input onChange={handleInput} type={password ? "text" : "password"} name="password" className='form-control' id="password" />

                            <button type="button" onClick={togglePassword} className={`btn btn-normal ${password ? 'bi bi-eye-slash': 'bi bi-eye'}`}></button>
                        </div>
                    </div>

                    {/* referral ID */}
                    <div className={`${styles['form-group']}`}>
                        <label htmlFor="referralId">Referer ID (optional)</label>
                        <input type="text" value={input.referralId} onChange={handleInput} name="referralId" className='form-control' id="" />
                    </div>

                    {/* accept terms */}
                    <div className={`form-group my-1 ${styles['accept-terms']}`}>
                        <input type="checkbox" required name="terms" id="terms" />
                        <label htmlFor="terms" className='small mx-1'>I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span></label>
                    </div>

                    <div className="form-group my-3">
                        <button disabled={registerBtn} type="submit" className='btn btn-primary btn-md w-100'>{registerBtn ? 'Processing...' : 'Register'}</button>
                    </div>
                </form>
                {/* register footer */}
                <div className={styles['register-footer']}>
                    <p>Already have an account? <NavLink to={'/account/login'}>Sign in instead</NavLink></p>
                    <div>
                        <GoogleTranslateCustom />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PublicRegister