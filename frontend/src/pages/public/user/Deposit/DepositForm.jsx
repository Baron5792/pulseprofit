import { useCallback, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router";
import { useNavigate } from "react-router";
import styles from '../../../../assets/css/user/Deposit.module.css';
import { useCsrfToken } from "../../../../component/middleware/Csrf-token";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DepositForm = () => {
    const { csrfToken, refreshCsrfToken } = useCsrfToken();

    const [searchParam] = useSearchParams();
    const reference_id = searchParam.get('reference_id');
    const navigate = useNavigate();
    const [walletData, setWalletData] = useState(null);


    // fetch deposit details from the referrence ID
    const fetchReference = useCallback(async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}fetch/deposit_reference.php?reference_id=${reference_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                credentials: 'include',
            })

            const request = await response.json();
            if (request.status === 'success') {
                setWalletData(request.data);
                refreshCsrfToken();
            }

            else {
                setWalletData(null);
                toast.error(request.message || "An error occured while fetching data", {toastId: 'access denied'});
                setTimeout(() => {
                    navigate('/user/deposit');
                }, 1000);
                refreshCsrfToken();
            }
        }

        catch (error) {
            toast.error("Network error");
            refreshCsrfToken();
        }
    }, [])

  

    const cancelDepositProcess = async(event) => {
        event.preventDefault();
        const rejectAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            html: '<p class="small">Current progress could be lost!</p>',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            cancelButtonColor: 'lightcoral',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed'
        });

        if (rejectAlert.isConfirmed) {
            try {
                const deleteResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}delete/delete-transaction.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken
                    },
                    body: JSON.stringify({ reference_id: reference_id }),
                    credentials: 'include'
                })

                if (!deleteResponse.ok) {
                    const errorMessage = await deleteResponse.json();
                    throw new Error(errorMessage.message || `Server responded with status ${deleteResponse.status}`);
                }

                const deleteRequest = await deleteResponse.json();

                if (deleteRequest.status === 'success') {
                    toast.success('success');
                    navigate('/user/deposit');  
                }

                else {
                    toast.error("An error occured while deleting transaction")
                }
            }

            catch (error) {
                toast.error("Something went wrong. Please check your network connection and try again");
            }
        }
    }
    
    // fetch wallets on render
    const [wallet, setWallet] = useState(null);
    const fetchWallets = useCallback(async() => {
        try { 
            const Query = await fetch (`${import.meta.env.VITE_APP_API_URL}fetch/wallets.php`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const queryResult = await Query.json();
            if (queryResult.status === 'success') {
                setWallet(queryResult.data);
                refreshCsrfToken();
            }

            else {
                toast.error(queryResult.message || "An error occured while fetching wallets");
                refreshCsrfToken();
            }
        }

        catch (error) {
            toast.error("Network error", {toastId: 'network-error'});
            refreshCsrfToken();
        }
    }, [csrfToken])
        

    useEffect(() => {
        if (reference_id === '' || !reference_id) {
            navigate('/user/deposit');
            return;
        }

    refreshCsrfToken();
    fetchWallets();
    fetchReference()
    document.title = `Deposit - ${import.meta.env.VITE_APP_NAME}`;
        
    }, [fetchReference]);


    // handle files submission
    const [formData, setFormData] = useState({
        amount: '',
        wallet_address: '',
        reference_id: reference_id
    })

    const required = ['amount', 'wallet_address']

    const handleDepositInput = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDepositSubmission = async(event) => {
        event.preventDefault();
        const isEmpty = required.some(value => formData[value].trim() === '');
        if (isEmpty) {
            toast.warning('All fields are required to proceed', {toastId: 'incomplete-form'});
            return;
        }

        const SwalAlert = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'Cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed',
        })

        if (SwalAlert.isConfirmed) {
            try {
                const formResponse = await fetch (`${import.meta.env.VITE_APP_API_URL}update/deposit_track.php`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken
                    },
                    body: JSON.stringify(formData)
                })

                const formRequest = await formResponse.json();
                if (formRequest.status === 'success') {
                    navigate(`/user/deposit/confirm?reference_id=${reference_id}`)
                }

                else {
                    toast.error(formRequest.message || "Something went wrong. Please try again", {toastId: 'error-log'});
                }
            }

            catch (error) {
                toast.error("Something went wrong, check your network connection and try again", {toastId: 'network-error'});
            }
        }
    }

    return (
        <>  
            <div>
                <p className={styles['page_title']}>Deposit Funds</p>
                <div className={styles['more_title']}>
                    {walletData ? (
                        <>
                            <p>via {walletData.wallet}</p>
                            <p>Send your payment direct to our wallet.</p>
                        </>
                    ): (
                        null
                    )}
                </div>
            </div> 

            {/* form input */}
            <form action="" className="mt-5" onSubmit={handleDepositSubmission}>
                <div className="row">
                    <div className={`${styles['form-data']} col-12 col-md-12 col-lg-12`}>
                        <label htmlFor="amount">Amount to Deposit <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <button type="button" className="input-text text-secondary btn btn-normal border bi bi-currency-dollar"></button>
                            <span className="bi bi-dollar-sign"></span>
                            <input onChange={handleDepositInput} type="number" className="form-control" name="amount" id="" />
                        </div>
                        <span className={styles['label_text']}><i className="bi bi-info-circle"></i> Minimum of 500 USD</span>
                    </div>
                    

                    <div className={`${styles['form-data']} col-12 col-md-12 col-lg-12 mt-4`}>
                        {/* select tag here */}
                        <label htmlFor="wallet">Select a Wallet <span className="text-danger">*</span></label>
                        <select onChange={handleDepositInput} name="wallet_address" id="" className="form-control">
                            <option value="">Click to select wallet</option>
                            {wallet && wallet.length > 0 ? (
                                <>
                                    {wallet.map((item) => (
                                        <option key={item.id} value={item.wallet_address}>{item.wallet_name}</option>
                                    ))}
                                </>
                            ): (
                                <option>No wallet found</option>
                            )}
                        </select>
                    </div>

                    <div className={`${styles['form-button']} py-5`}>
                        {walletData ? (
                            <>
                                <button type="submit" className="form-control mb-4">Continue to Deposit</button>
                                <NavLink onClick={cancelDepositProcess} className={'mt-5'}>Cancel Process</NavLink>
                            </>
                        ): (
                            null
                        )}
                            
                    </div>
                </div>
            </form>
        </>
    )
}

export default DepositForm;