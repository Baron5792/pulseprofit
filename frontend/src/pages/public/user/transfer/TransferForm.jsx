import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Withdraw.module.css';
import { toast } from 'react-toastify';
import { useCsrfToken } from '../../../../component/middleware/Csrf-token';
import css from '../../../../assets/css/user/Transfer.module.css';
import UnknownImg from '../../../../assets/images/avatar/unknown.jpeg';
import Beneficiaries from './Beneficiaries';
import { useNavigate } from 'react-router-dom'

const TransferForm = () => {
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        account_number: ''
    })

    const handleAccountInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const [userResult, setUserResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSearchUser = async(event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}fetch/transfer_user.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify(formData)
            })

            const request = await response.json();
            if (request.status === 'success') {
                setTimeout(() => {
                    setLoading(false);
                    setUserResult(request.data);
                }, 4000)
            }

            else {
                setTimeout(() => {
                    setLoading(false);
                    setUserResult(null);
                    toast.error(request.message || 'Something went wrong', {toastId: 'error'});
                }, 2000);
            }
        }

        catch (error) {
            setTimeout(() => {
                setLoading(false);
                setUserResult(null);
                toast.error('Network error', {toastId: 'network-error'});
            }, 2000)
        }
    }

    useEffect(() => {
        refreshCsrfToken();
        document.title = `Transfer - ${import.meta.env.VITE_APP_NAME}`;
    }, [])

    // save intial transfer record
    const [proceedBtn, setProceedBtn] = useState(false);
    const saveTransferUser = async(reg_id) => {
        setProceedBtn(true);
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}insert/initial_transfer_record.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ reg_id: reg_id })
            })

            const request = await response.json();
            if (request.status === 'success') {
                setTimeout(() => {
                    setProceedBtn(false);
                    navigate(`/user/transfer/transfer-details?reference=${request.reference}`)
                }, 3000)
            }

            else {
                setTimeout(() => {
                    setProceedBtn(false);
                    toast.error('An error occured while processing your request', {toastId: 'transfer-error'});
                }, 3000)
            }
        }

        catch (error) {
            setTimeout(() => {
                setProceedBtn(false);
                toast.error('Network error', {toastId: 'network-error'});
            }, 3000)
        }
    }

    return (
        <>
            <div>
                <p className={styles['page_title']}>Verification</p>

                <div className={styles['more_title']}>
                    <p>Select a Recipient</p>
                    <p>Quickly and securely send funds to any user..</p>
                </div>
            </div>  

            <div>
                <form onSubmit={handleSearchUser}>
                    <div className="row">
                        <div className={`${styles['form-data']} mt-5 col-12 col-md-12 col-lg-12`}>
                            <label htmlFor="account_number">Recepient Account <span className='text-danger'>*</span></label>
                            <div className="input-group">
                                <input placeholder='123456789...' type="number" onChange={handleAccountInput} name="account_number" className='form-control' />
                                <button type="submit" className={`btn btn-normal border`}>
                                    {loading ? 
                                        <span className='spinner-border spinner-grow-sm'></span>
                                    : 
                                        <span className='bi bi-search'></span>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* display transfer users details here */}
                
                {userResult && (
                    <>
                        <div className={css['user_display_info_container']}>
                            <div className={css['user_image']}>
                                <img src={userResult.avatar && userResult.avatar.length > 1 ? import.meta.env.VITE_APP_AVATAR + userResult.avatar : UnknownImg} alt="__blank" />
                            </div>
                            <div className={css['users_info']}>
                                <p>{userResult ? userResult.fullname : 'null'}</p>
                                <p>@{userResult ? userResult.username : 'null'}</p>
                            </div>
                        </div>

                        {/* add as beneficiary */}
                        

                        <div className={styles['form-button']}>
                            <button type="button" onClick={() => saveTransferUser(userResult.reg_id)} className='form-control'>
                                {proceedBtn ? 
                                    <span className='spinner-border spinner-grow-sm'></span>
                                    :
                                    <span>Continue</span>
                                }
                            </button>
                        </div>
                    </>
                )}

            </div>


            {/* beneficiaries here */}
            <Beneficiaries />
        </>
    )
}

export default TransferForm;