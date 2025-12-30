import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Withdraw.module.css';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useUser } from '../../../../component/middleware/Authentication';

const WithdrawWallet = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useUser();
    const [formData, setFormData] = useState({
        wallet: ''
    });
    const handleWallet = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const isEmpty = Object.values(formData).some(value => value.trim() === '');
        if (isEmpty){
            toast.warning('A withdrawal method is required.', {toastId: 'incomplete'});
            return;
        }

        navigate('/user/withdraw/withdrawal_form');
    }

    useEffect(() => {
        document.title = `Withdrawal - ${import.meta.env.VITE_APP_NAME}`;
        refreshUser();
    })

    return (
        <>
            <div>
                <p className={styles['page_title']}>Withdraw your Funds</p>

                <div className={styles['more_title']}>
                    <p>Select from payment options below</p>
                    <p>Securely withdraw money from your account.</p>
                </div>
            </div>  


            <div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className={`${styles['form-group']} form-group col-12 col-md-12 mt-5 col-lg-12`}>
                            <div className='d-flex justify-content-between'>
                                <label className={styles['container']}>
                                    <input value={'Crypto Wallet'} onChange={handleWallet} type="radio" name='wallet' />
                                    <span className={styles['checkmark']}></span> Crypto Withdrawal
                                </label>
                                <div>
                                    <span className='bi bi-arrow-up-circle text-secondary'></span>
                                </div>
                            </div>
                        </div>

                        <div className={styles['plan_container']}>
                            <div className="d-flex">
                                <div className={styles['plan_icon']}>
                                    <span className='bi bi-tags-fill'></span>
                                </div>
                                <div className={`${styles['plan_details']} px-3`}>
                                    <p>Withdraw From</p>
                                    {user && (
                                        <p>Available Balance {user.interest} USD</p>
                                    )}
                                </div>
                            </div>
                        </div>

                       
                        <div className={`${styles['form-button']} g-0 col-12 col-md-12 col-lg-12`}>
                            <button type="submit" className='form-control'>Withdraw Now</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default WithdrawWallet;