import styles from '../../assets/css/user/Dashboard.module.css';
import { NavLink } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import css from '../../assets/css/user/Transaction.module.css'

const RecentTransactions = () => {

    const [data, setData] = useState(null);
    const fetchTransactions = useCallback(async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}fetch/all_transactions.php`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'applications/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setData(request.data);
            }
            else {
                setData(null);
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
        }
    }, [])

    const LimitedTransactions = data ? data.slice(0, 4) : [];

    useEffect(() => {
        fetchTransactions();
    })

    // fetch transaction modal
    const [transaction, setTransaction] = useState(null);
    const [transactionModal, setTransactionModal] = useState(false);
    const openTransactionModal = async(transactionId) => {
        setTransactionModal(true);
        try {
            // fetch transaction with ID
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}fetch/fetch_instant_trasaction.php?transactionid=${transactionId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setTransaction(request.data);
            }

            else {
                setTransaction(null);
                toast.warning('Something went wrong', {toastId: 'error'});
                setTransactionModal(false);
            }
        }

        catch (error) {
            toast.warning('Network error', {toastId: 'network error'});
            setTransactionModal(false);
            setTransaction(null);
        }
    }

    const closeTransactionModal = () => {
        setTransactionModal(false);
    }

    const copyReferenceId = async(referenceId) => {
        try {
            navigator.clipboard.writeText(referenceId);
            toast.info('Reference ID has been copied successfully', {toastId: 'success'});
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
            <div className="col-12 col-md-12 col-lg-12 my-5">
                <div className="d-flex justify-content-between">
                    <p className={styles['transaction_text']}>Recent Transactions 
                        <span className={`${styles['transaction_arrow']} bi bi-arrow-left-right mx-2 small`}></span>
                    </p>
                    <NavLink to={'/user/transaction'} className={'text-decoration-none'}>See History</NavLink>
                </div>
                <div className={styles['transaction_main_container']}>
                    {LimitedTransactions && LimitedTransactions.length > 0 ? (
                        LimitedTransactions.map((transaction) => {
                            const titleLower = transaction.title ? transaction.title.toLowerCase() : '';
                            
                            let sign = '';
                            let amountClass = 'text-secondary'; // Default color

                            if (titleLower.includes('deposit') || titleLower.includes('profit') || titleLower.includes('incoming transfer')) {
                                sign = '+';
                                amountClass = 'text-success'; // Green for incoming money
                            } else if (titleLower.includes('withdraw') || titleLower.includes('investment' || titleLower.includes('charge'))) {
                                sign = '-';
                                amountClass = 'text-danger'; // Red for outgoing money
                            }


                            return (
                                <div className={`${styles['transaction_history_container']}`} key={transaction.id}>
                                    <div className="d-flex">
                                        <p className={sign === '+' ? `${styles['transaction_icon']} mx-2`: `${styles['transaction_icon_red']} mx-2`}>
                                            <span className={sign === '+' ? "bi-arrow-up-right" : "bi-arrow-down-left"}></span>
                                        </p>
                                        <div className={styles['transaction_title']}>
                                            <p>{transaction.title}</p>
                                            <p>{new Date(transaction.date).toLocaleDateString()} <span className="mx-2"></span> {transaction.status}</p>
                                        </div>
                                    </div>

                                    <div className={`${styles['transaction_amount']} d-flex`}>
                                        <p className={amountClass}>{sign} {formatCurrency(transaction.amount)} <span className="text-secondary">USD</span></p>
                                        <i onClick={() => openTransactionModal(transaction.id)} className="bi bi-three-dots small mx-2"></i>
                                    </div>
                                </div>  
                            )
})
                    ): (
                        <div className='alert alert-info'>
                            <span>No recent transaction found</span>
                        </div>
                    )}
                        
                </div>
            </div>

            {/* transaction modal */}
            {transaction && (
                <Modal show={transactionModal}>
                    <div className={css['modal_body']}>
                        <div className={css['modal_header']}>
                            <p>ID - #{transaction?.txn_id}</p>
                            <button onClick={closeTransactionModal} type="button" className='btn btn-normal bi bi-x fs-4'></button>
                        </div>

                        <div className={css['modal_content']}>
                            <div className={css['transaction_modal_title']}>
                                <p>Details</p>
                            </div>
                            
                            <div className={css['others']}>
                                <p>Transaction Title</p>
                                <p>{transaction?.title}</p>
                            </div>

                            <div className={css['others']}>
                                <p>Transaction Amount</p>
                                <p>{formatCurrency(transaction?.amount)} USD</p>
                            </div>

                            <div className={css['others']}>
                                <p>Transaction Status</p>
                                <p>{transaction?.status}</p>
                            </div>
                        </div>

                        <div className={css['modal_content']}>
                            <div className={css['transaction_modal_title']}>
                                <p>Additional Details</p>
                            </div>
                            
                            <div className={css['others']}>
                                <p>Cryptocurrency</p>
                                <p>{transaction?.wallet_name}</p>
                            </div>

                            <div className={css['others']}>
                                <p>From</p>
                                <p>{transaction?.from}</p>
                            </div>

                            <div className={css['others']}>
                                <p>Reference ID</p>
                                <p>{transaction && transaction.reference_id.length > 20 ? transaction.reference_id.slice(0, 20) + '...': transaction.reference_id } <span className='btn btn-normal bi bi-copy small p-0' onClick={() => copyReferenceId(transaction.reference_id)}></span></p>
                            </div>

                            <div className={css['others']}>
                                <p>Date</p>
                                <p>{new Date(transaction?.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default RecentTransactions;