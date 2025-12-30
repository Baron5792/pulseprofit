import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Withdraw.module.css';
import { useUser } from '../../../../component/middleware/Authentication';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const TransferWallet = () => {
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser();
        document.title = `Transfer Money - ${import.meta.env.VITE_APP_NAME}`;
    }, [])

    const [formData, setFormData] = useState({
        wallet: ''
    })

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const [submitBtn, setSubmitBtn] = useState(false);
    const handleWalletSubmit = async(event) => {
        setSubmitBtn(true);
        event.preventDefault();

        const isEmpty = Object.values(formData).some(value => value.trim() === '');
        if (isEmpty) {
            toast.warning("A Transfer method is required to proceed", {toastId: 'empty-input'});
            setTimeout(() => {
                setSubmitBtn(false);
            }, 2000)
            return;
        }

        else {
            // redirect to the transfer form page
            setTimeout(() => {
                navigate('/user/transfer/transfer-form');
            }, 2000)
        }
    }

    const copyRegId = async(regId) => {
        try {
            const copy = navigator.clipboard.writeText(regId);
            if (copy) {
                toast.success('Account number has been copied successfully', {toastId: 'success'});
            }
        }
        catch (error) {
            toast.error('Something went wrong', {toastId: 'something-error'});
        }
    }

    
    const formatCurrency = (amount) => {
        // 1. Convert the input to a number first, just in case it's a string
        const numericAmount = parseFloat(amount); 
        
        // 2. Check if the conversion resulted in a valid number
        if (isNaN(numericAmount)) {
            return 'N/A'; // Return a safe string instead of a crash/NaN
        }

        // 3. Perform the formatting
        const numberFormatter = new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            minimumFractionDigits: 2, 
        });

        return numberFormatter.format(numericAmount);
    };

    return (
        <>
            <div>
                <p className={styles['page_title']}>Send Money</p>

                <div className={styles['more_title']}>
                    <p>Select a Recipient</p>
                    <p>Quickly and securely send funds to any user..</p>
                </div>
            </div>  
            
            
            <div>
                <form action="" onSubmit={handleWalletSubmit}>
                    <div className="row">
                        <div className={`${styles['form-group']} form-group col-12 col-md-12 mt-5 col-lg-12`}>
                            <div className='d-flex justify-content-between'>
                                <label className={styles['container']}>
                                    <input value={'Crypto Wallet'} onChange={handleInput}  type="radio" name='wallet' />
                                    <span className={styles['checkmark']}></span> Bank Account Transfer
                                </label>
                                <div>
                                    <span className='bi bi-bank text-secondary'></span>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles['form-data']} mb-4 p-0 col-12 col-md-12 col-lg-12 col-xl-12`}>
                            <label htmlFor="account number">Your Account Number</label>
                            <div className="input-group">
                                {user && (
                                    <>
                                        <input type="text" name="" value={user.reg_id} readOnly className='form-control' id="" />
                                        <button type="button" onClick={() => copyRegId(user.reg_id)} className='btn btn-normal bi bi-copy'></button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={styles['plan_container']}>
                            <div className="d-flex">
                                <div className={styles['plan_icon']}>
                                    <span className='bi bi-tags-fill'></span>
                                </div>
                                <div className={`${styles['plan_details']} px-3`}>
                                    <p>Transfer From</p>
                                    {user && (
                                        <p>Available Balance {formatCurrency(user.balance)} USD</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        
                        <div className={`${styles['form-button']} g-0 col-12 col-md-12 col-lg-12`}>
                            <button type="submit" disabled={submitBtn} className='form-control'>{submitBtn ? 
                            <>
                                <span>Processing </span>
                                <i className='spinner-border spinner-grow-sm'></i>
                            </>
                            : 'Transfer Now'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default TransferWallet;