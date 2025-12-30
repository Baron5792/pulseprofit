import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import styles from '../../../../assets/css/user/Invest.module.css';
import UnknownImg from '../../../../assets/images/avatar/unknown.jpeg';
import { useUser } from '../../../../component/middleware/Authentication';
import { useNavigate } from "react-router";
import { useCsrfToken } from "../../../../component/middleware/Csrf-token";
import Swal from "sweetalert2";

const TransferCompletion = () => {
    const {user} = useUser();
    const [searchParam] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParam.get('reference');
    const { csrfToken, refreshCsrfToken } = useCsrfToken();

    const [data, setData] = useState(null);
    const fetchData = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/transfer-final-records.php?reference=${reference}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setData(request.data);
            }

            else {
                toast.error(request.message || "Something went wrong", {toastId: 'something-error'});
                setData(null);
                navigate('/user/transfer');
                
            }
        }

        catch (error) {
            toast.error('Network error', {toastId: 'network-error'});
            setData(null);
            navigate('/user/transfer');
        }
    }

    useEffect(() => {
        fetchData();
        document.title = `Transfer Completion - ${import.meta.env.VITE_APP_NAME}`;
        refreshCsrfToken();
    }, [])

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


    // handle transfer final stage
    const [submit, setSubmit] = useState(false);
    const confirmTransfer = async(reference) => {
        const SwalAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'Return',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed'
        })

        if (SwalAlert.isConfirmed) {
            setSubmit(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}insert/new_transfer.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken
                    },
                    credentials: 'include',
                    body: JSON.stringify({ reference: reference })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    setTimeout(() => {
                        navigate('/user/transaction');
                        toast.success('Transaction successful!!', {toastId: 'success'});
                    }, 2000)
                }

                else {
                    setTimeout(() => {
                        toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                        setSubmit(false);
                    }, 2000)
                }
            }

            catch (error) {
                setTimeout(() => {
                    toast.error('Network error', {toastId: 'network-error'});
                    setSubmit(false);
                }, 2000)
            }
        }
            
    }

    return (
        <>
            <div className={styles['investment_intro']}>
                <p>Confirm Your Transfer</p>
                <p>Please review your transfer details before proceeding.</p>
            </div>

             <div className={styles['plan_con']}>
                <div className="row">
                    <div className={`${styles['plan_title']} col-4 col-md-4 col-lg-4`}>
                        <p>Type</p>
                        {data && (
                            <p>Peer-to-peer</p>
                        )}
                    </div>

                    <div className={`${styles['plan_title']} col-4 col-md-4 col-lg-4`}>
                        {data && (
                            <div className={styles['plan_img']}>
                                <img src={data.avatar && data.avatar.length > 1 ? import.meta.env.VITE_APP_AVATAR + data.avatar: UnknownImg} alt="_blank" />
                            </div>
                        )}
                    </div>

                    <div className={`${styles['plan_title']} col-4 col-md-4 col-lg-4`}>
                        <p>Recipient</p>
                        {data && (
                            <p>{data.fullname}</p>
                        )}
                    </div>
                </div>
            </div>

            {data && (
                <>
                    <div className={styles['plan_display']}>
                        <div className={styles['plan_info']}>
                            <p>Payment Account</p>
                            <p><span className="bi bi-wallet"></span> Main Balance</p>
                        </div>
                        {/* amount to invest */}
                        <div className={styles['plan_info']}>
                            <p>Amount to Transfer</p>
                            <p>{formatCurrency(data.amount)} USD</p>
                        </div>
                        {/* profit */}
                        <div className={styles['plan_info']}>
                            <p>Ending Balance</p>
                            {user && (
                                <p>{formatCurrency(user.balance - data.amount)} USD</p>
                            )}
                        </div>
                    </div>

                    <div className={styles['plan_display']}>
                        <div className={styles['plan_info']}>
                            <p>Amount to debit</p>
                            <p>{formatCurrency(data.amount)} USD</p>
                        </div>
                    </div>
                </>
            )}


            <span className={styles['conclusion']}>*The amount will be deducted immediately from your account balance once you confirm.</span>
            
            {data && (
                <div className={`${styles['submit_btn']}`}>
                    <button disabled={submit} type="button" onClick={() => confirmTransfer(data.reference)} className='form-control btn btn-primary'>{submit ? 'Processing...': 'Confirm & Proceed '}
                        <span className={submit ? 'spinner-border spinner-grow-sm text-white mx-2': ''}></span>
                    </button>
                </div>
            )}
        </>
    )
}

export default TransferCompletion;