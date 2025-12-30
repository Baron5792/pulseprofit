import { toast } from 'react-toastify';
import styles from '../../../../assets/css/user/Invest.module.css';
import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';   
import { useNavigate } from 'react-router';
import css from '../../../../assets/css/user/Transfer.module.css';
import { useCsrfToken } from '../../../../component/middleware/Csrf-token';
import Swal from 'sweetalert2';
import Beneficiaries from './Beneficiaries';

const TransferDetails = () => {
    const [ searchParam ] = useSearchParams();
    const referenceId = searchParam.get('reference');
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const navigate = useNavigate();

    // fetch data from the reference ID
    const [data, setData] = useState(null);
    const fetchData = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/transfer-info.php?reference=${referenceId}`, {
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
                setData(null);
                toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                navigate('/user/transfer');
                return;
            }
        }

        catch (error) {
            setData(null);
            toast.error(error.message || 'Network error', {toastId: 'network-error'});
            navigate('/user/transfer');
            return;
        }
    }

    useEffect(() => {
        document.title =  `Peer-to-peer Transfer - ${import.meta.env.VITE_APP_NAME}`;
        fetchData();
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

    const [formData, setFormData] = useState({
        amount: ''
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const [submit, setSubmit] = useState(false);
    const handleSubmission = async (event) => {
        setSubmit(true)
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}update/transfer-track.php`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ amount: formData.amount, reference: referenceId })
            })

            const request = await response.json();
            if (request.status === 'success') {
                setTimeout(() => {
                    navigate(`/user/transfer/transfer-completion?reference=${referenceId}`)
                }, 4000)
            }

            else {
                setTimeout(() => {
                    setSubmit(false);
                    toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                }, 2000)
            }
        }

        catch (error) {
            setTimeout(() => {
                setSubmit(false);
                toast.error('Network error', {toastId: 'network-error'});
            }, 2000)
        }
    }

    // cancel transfer process
    const deleteRef = async(reference) => {
        const swalAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            html: '<p class="small">Current process would be lost !</p>',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'Return',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed'
        })

        if (swalAlert.isConfirmed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}delete/transfer-records.php`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reference: reference })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    navigate('/user/transfer');
                    toast.info('Transfer process has been successfully terminated', {toastId: 'success'});
                }

                else {
                    toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                }
            }

            catch (error) {
                toast.error('Network error', {toastId: 'network-error'});
            }
        }
    }


    // for beneficiary toggle
    const [isChecked, setIsChecked] = useState(false);
    const handleCheck = async(e) => {
        const newState = e.target.checked;
        setIsChecked(newState);
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}insert/create-beneficiary.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ newState: newState, referenceId: referenceId })
            })

            const request = await response.json();
            if (request.status === 'success') {
                toast.info(request.message, {toastId: 'success'});
            }

            else {
                toast.warning(request.message || 'Something went wrong', {toastId: 'something-error'});
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'something-error'});
        }
    }   

    const id = 'saveAsBeneficiarySwitch';

    return (
        <>
            <div className={styles['investment_intro']}>
                <p>Secure Money Transfer Hub</p>
                <p>#TXN-{data && (
                    data.txn_id
                )}</p>
            </div>

            <div className={styles['title']}>
                <p>Transfer Details</p>
            </div>

            {/* transfer info display */}
            <div className={styles['plan_container']}>
                <div className="d-flex">
                    <div className={styles['plan_icon']}>
                        <span className='bi bi-arrow-left-right'></span>
                    </div>
                    <div className={`${styles['plan_details']} px-3`}>
                        <p>Peer-to-peer</p>
                        {data && (
                            <p>Recipient: {data.fullname}</p>
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmission}>
                {/* amount inputed */}
                <div className={styles['inputed_amount']}>
                    <div className={styles['title']}>
                        <p>Enter amount <span className='text-danger'>*</span></p>
                    </div>

                    <div className={styles['amount_input']}>
                        <div className="input-group">
                            <input type="number" onChange={handleInput} readOnly={submit} name='amount' placeholder='1000' className='form-control' />
                            <span className="input-group-text bg-white text-secondary">USD</span>
                        </div>
                        {data && (
                            <div className={styles['min_max']}>
                                <span>Minimum: 5.00 USD</span>
                                <span>Maximum: {formatCurrency(data.balance)} USD</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles['inputed_amount']}>
                    {/* main balance */}
                    <div className={styles['title']}>
                        <p>Payment Acount</p>
                    </div>
                    <div className={styles['plan_container']}>
                        <div className="d-flex">
                            <div className={styles['plan_icon']}>
                                <span className='bi bi-wallet'></span>
                            </div>
                            { data ? (
                                <div className={`${styles['plan_details']} px-3`}>
                                    <p>Main Balance</p>
                                    <p>Current Balance: {formatCurrency(data.balance)} USD</p>
                                </div>
                            ): (
                                null
                            ) }
                            
                        </div>
                    </div>
                </div>

                <div className="d-flex mt-4">
                    <label htmlFor='toggle'>Add as beneficiary</label>
                    <div className={`form-switch p-1 ${styles['inputed_amount']} mx-5`}>
                        <input
                            // JSX attribute: className instead of class
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name='switch'
                            id={id}
                            checked={isChecked}
                            onChange={handleCheck}
                        />
                        <label 
                            className="form-check-label fw-semibold text-dark user-select-none" 
                            htmlFor={id}
                        >
                        </label>
                    </div>
                </div>

                {/* button submit */}
                <div className={`${styles['submit_btn']}`}>
                    <button type="submit" disabled={submit} className='form-control btn btn-primary'> Continue 
                        {submit ? 
                            <span className='spinner-border spinner-grow-sm mx-1 text-white'></span>
                            :
                            null
                        }
                    </button>
                    {data && (
                        <p className={css['cancel_btn']} onClick={() => deleteRef(data.reference)}>Cancel</p>
                    )}
                    <span>By clicking on the button above you accept to our transfer terms and conditions</span>
                </div>
            </form>

            <Beneficiaries />
        </>
    )
}

export default TransferDetails;