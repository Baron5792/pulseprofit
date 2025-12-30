import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Deposit.module.css';
import { useCsrfToken } from '../../../../component/middleware/Csrf-token';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const Deposit = () => {
    const { csrfToken, refreshCsrfToken }  = useCsrfToken();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Deposit - ${import.meta.env.VITE_APP_NAME}`;
        refreshCsrfToken();
    })

    const [wallet, setWallet] = useState({
        wallet: ''
    })

    const handleWallet = (event) => {
        const { name, value } = event.target;
        setWallet(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmission = async(event) => {
        event.preventDefault();
        const isEmpty = Object.values(wallet).some(value => value.trim() === '');
        if (isEmpty) {
            toast.warning('Please select a wallet to proceed with your deposit'); 
            return;
        }

        // fetch api
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}insert/deposit_wallet.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify(wallet)
            })

            const request = await response.json();
            if (request.status === 'success') {
                navigate(`/user/deposit/deposit_form?reference_id=${request.reference_id}`)
            }

            else {
                toast.error("An error occured during the deposit process. Please try again later");
            }
        }

        catch (error) {
            toast.error("Network error");
        }
    }

    return (
        <>
            <div>
                <p className={styles['page_title']}>Deposit Funds</p>

                <div className={styles['more_title']}>
                    <p>Select from payment options below</p>
                    <p>Securely and safely deposit money into your account.</p>
                </div>
            </div>  

            <div>
                <form action="" onSubmit={handleSubmission}>
                    <div className="row">
                        <div className={`${styles['form-group']} form-group col-12 col-md-12 mt-5 col-lg-12`}>
                            <div className='d-flex justify-content-between'>
                                <label className={styles['container']}>
                                    <input value={'Crypto Wallet'} type="radio" name='wallet' onChange={handleWallet} />
                                    <span className={styles['checkmark']}></span> Crypto Wallet
                                </label>
                                <div>
                                    <span className='bi bi-wallet text-secondary'></span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className='small text-secondary'>By clicking the button, you acknowledge that you have read and agree to our Terms and Conditions.</p>
                        </div>

                         <div className={`${styles['form-button']} g-0 col-12 col-md-12 col-lg-12`}>
                            <button type="submit" className='form-control'>Deposit Now</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Deposit;