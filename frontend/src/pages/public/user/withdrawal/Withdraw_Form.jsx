import { useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Withdraw.module.css';
import { toast } from 'react-toastify';
import { useUser } from '../../../../component/middleware/Authentication';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const WithdrawalForm = () => {
    const { user, refreshUser } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        coin_name: '',
        network: '',
        wallet_address: '',
        amount: '',
    })

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const requiredField = ['coin_name', 'wallet_address', 'amount'];
    const [submitBtn, setSubmitBtn] = useState(false);

    const submitWithdrawal = async (event) => {
        event.preventDefault();

        for (let fields of requiredField) {
            if (!formData[fields]) {
                toast.warning('Please fill every required fields to proceed', {toastId: 'input_missing'});
                return;
            }
        }

        const Alert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            html: `
                <p class='text-start small'>
                    You are about to withdraw <b>${formData.amount}.00 USD </b> to the following address:
                </p>
                <div class='bg-light p-2 rounded text-break mb-3'>
                    <p class='small m-0 text-start'>Address: <b>${formData.wallet_address}</b></p>
                </div>
                <p class='small text-danger fw-bold'>
                    Cryptocurrency transactions are **IRREVERSIBLE**.
                    If the address or network is incorrect, your funds will be permanently lost.
                </p>
                <p class='small mt-3'>
                    Please confirm that all details are correct to proceed.
                </p>
            `,
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Yes, withdraw'
        })

        if (Alert.isConfirmed) {
            setSubmitBtn(true);
            try {
                // spmething went wrong error
                setTimeout(() => {
                    toast.error('Something went wrong!', {toastId: 'error'});
                    setSubmitBtn(false);
                }, 4000)

                // const response = await fetch(`${import.meta.env.VITE_APP_API_URL}insert/new_withdrawal.php`, {
                //     method: 'POST',
                //     credentials: 'include',
                //     body: JSON.stringify(formData),
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // })

                // const request  = await response.json();
                // if (request.status === 'success') {
                //     toast.success('Withdrawal pending. Reviewing for security approval.', {toastId: 'success'});
                //     navigate('/user/transaction/withdrawal');
                // }

                // else {
                //     toast.error(request.message || 'Something went wrong', {toastId: 'something wrong'});
                // }
            }

            catch (error) {
                toast.error('Network error', {toastId: 'network-error'});
            }
        }
    }

    useEffect(() => {
        document.title = `Withdrawal - ${import.meta.env.VITE_APP_NAME}`;
        refreshUser();
    }, [])
    return (
        <>
            <div>
                <p className={styles['page_title']}>Withdraw your Funds</p>

                <div className={styles['more_title']}>
                    <p>Via Crypto Wallet</p>
                    <p>Receive your funds directly to your personal crypto wallet.</p>
                </div>
            </div>  


            {/* inputs here */}
            <form onSubmit={submitWithdrawal} className="mt-5">
                <div className="row">
                    <div className={`${styles['form-data']} col-12 col-md-12 col-lg-12`}>
                        <label htmlFor="cryptocurrency">Cryptocurrency (coin) selection <span className="text-danger">*</span></label>
                        <div>
                            <span className="bi bi-dollar-sign"></span>
                            <input type="text" onChange={handleInput} placeholder='E.g. Bitcoin (BTC)' className="form-control" name="coin_name" id="" />
                        </div>
                    </div>

                    <div className={`${styles['form-data']} col-12 col-md-12 col-lg-12`}>
                        <label htmlFor="cryptocurrency">Withdrawal Network / Chain (optional)</label>
                        <div>
                            <span className="bi bi-dollar-sign"></span>
                            <input type="text" onChange={handleInput} placeholder='E.g. ERC-20' className="form-control" name="network" id="" />
                        </div>
                    </div>

                    <div className={`${styles['form-data']} col-12 col-md-12 col-lg-12`}>
                        <label htmlFor="cryptocurrency">Recipient Wallet Address <span className='text-danger'>*</span></label>
                        <div>
                            <span className="bi bi-dollar-sign"></span>
                            <input type="text" onChange={handleInput} className="form-control" name="wallet_address" id="" />
                        </div>
                        <span className={styles['label_text']}>Paste your correct wallet address here. Confirm it matches the selected network to avoid errors.</span>
                    </div>

                    <div className={`${styles['form-data']} col-12 col-md-12 col-lg-12`}>
                        <label htmlFor="cryptocurrency">Amount to Withdraw (USD) <span className='text-danger'>*</span></label>
                        <div className='input-group'>
                            <button className="bi bi-hash bg-light btn btn-white text-secondary input-group-text"></button>
                            <input type="number" onChange={handleInput} className="form-control" name="amount" id="" />
                        </div>
                    </div>

                    <div className={`${styles['form-button']} col-12 col-md-12 col-lg-12`}>
                        <button disabled={submitBtn} type="submit" className='form-control'>{submitBtn ? 'Processing...': 'Withdraw Now'}</button>
                    </div>
                </div>  
            </form>
        </>
    )
}

export default WithdrawalForm;