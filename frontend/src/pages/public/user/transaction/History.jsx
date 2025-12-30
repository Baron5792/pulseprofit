import { useCallback, useEffect, useState } from 'react';
import styles from '../../../../assets/css/user/Transaction.module.css';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const formatCurrency = (amount) => {
    // Return empty string or 0.00 if amount is missing or invalid
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.00'; 
    }
    
    // Use Intl.NumberFormat for robust, localized formatting
    const numberFormatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return numberFormatter.format(amount);
};


export const History = () => {
    

     // fetch transactions for this users
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


    
    // for amount format
    let formattedAmount = '';
    let rawAmount = '';

    if (data) {
        rawAmount = data.amount; // Store the original amount
        
        const numberFormatter = new Intl.NumberFormat('en-US', {
            style: 'decimal', 
            minimumFractionDigits: 2, 
        });

        formattedAmount = numberFormatter.format(rawAmount);
    }

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const getFilteredTransactions = () => {
        if (!data) return null; // Use null to distinguish between loading and empty results
        if (!searchTerm) return data; 
        
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return data.filter(item => {
            // Search in multiple fields 
            const titleMatch = item.title.toLowerCase().includes(lowerCaseSearchTerm);
            const walletMatch = item.wallet_name.toLowerCase().includes(lowerCaseSearchTerm);
            const txnIdMatch = item.txn_id.toLowerCase().includes(lowerCaseSearchTerm);
            const statusMatch = item.status.toLowerCase().includes(lowerCaseSearchTerm);
            const amountString = String(item.amount);
            const amountMatch = amountString.includes(lowerCaseSearchTerm);
            return titleMatch || walletMatch || txnIdMatch || statusMatch || amountMatch;
        });
    };

    const filteredData = getFilteredTransactions();

    useEffect(() => {
        document.title = `All History - ${import.meta.env.VITE_APP_NAME}`;
        fetchTransactions();
    }, [fetchTransactions])

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
        setTransaction(null);
        setTransactionModal(false);
    }

    const copyReferenceId = async(reference_id) => {
        try {
            navigator.clipboard.writeText(reference_id);
            toast.info('Reference ID has been copied successfully', {toastId: 'copy success'});
        }

        catch (error) {
            toast.warning('Something went wrong', {toastId: 'something-error'});
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
            <div className={`${styles['search_container']}`}>
                <form action="" onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group">
                        <input type="text" value={searchTerm} onChange={handleSearchChange} name="" placeholder='Search...' className='form-control' id="" />
                        {/* <button type="submit" className='input-text btn btn-normal bi bi-search'></button> */}
                    </div>
                </form>
            </div>

             {/* recent transaction */}
            <div className="col-12 col-md-12 col-lg-12 my-4">
                <div className={styles['transaction_main_container']}>

                    {filteredData && filteredData.length > 0 ? (
                        filteredData.map((item) => {
                            
                            const titleLower = item.title ? item.title.toLowerCase() : '';
                            
                            let sign = '';
                            let amountClass = 'text-secondary'; // Default color

                            if (titleLower.includes('deposit') || titleLower.includes('profit') || titleLower.includes('incoming transfer')) {
                                sign = '+';
                                amountClass = 'text-success'; // Green for incoming money
                            } else if (titleLower.includes('withdraw') || titleLower.includes('investment')) {
                                sign = '-';
                                amountClass = 'text-danger'; // Red for outgoing money
                            }

                            return (
                                <div key={item.id} className={`${styles['transaction_history_container']}`}>
                                    <div className="d-flex">
                                        <p className={sign === '+' ? `${styles['transaction_icon']} mx-2`: `${styles['transaction_icon_red']} mx-2`}>
                                            <span className={sign === '+' ? 'bi-arrow-up-right': 'bi-arrow-down-left'}></span>
                                        </p>
                                        <div className={styles['transaction_title']}>
                                            <p>{item.title}</p>
                                            <p>{item.date && new Date(item.date).toLocaleDateString()} <span className="mx-2"></span> {item.status}</p>
                                        </div>
                                    </div>

                                    <div className={`${styles['transaction_amount']} d-flex`}>
                                        <p className={amountClass}>{sign} {formatCurrency(item.amount)} <span className="text-secondary">USD</span></p>
                                        <i onClick={() => openTransactionModal(item.id)} className="bi bi-three-dots text-secondary small mx-2"></i>
                                    </div>
                                </div>  
                            )
                        })  
                            
                    ): (
                        <div className='alert alert-info w-100'>
                            <span className='text-center small'>No transactions found</span>
                        </div>
                    )}
                </div>
            </div>


            {/* transaction modal */}
            {transaction && (
                <Modal show={transactionModal}>
                    <div className={styles['modal_body']}>
                        <div className={styles['modal_header']}>
                            <p>ID - #{transaction?.txn_id}</p>
                            <button onClick={closeTransactionModal} type="button" className='btn btn-normal bi bi-x fs-4'></button>
                        </div>

                        <div className={styles['modal_content']}>
                            <div className={styles['transaction_modal_title']}>
                                <p>Details</p>
                            </div>
                            
                            <div className={styles['others']}>
                                <p>Transaction Title</p>
                                <p>{transaction?.title}</p>
                            </div>

                            <div className={styles['others']}>
                                <p>Transaction Amount</p>
                                <p>{formatCurrency(transaction?.amount)} USD</p>
                            </div>

                            <div className={styles['others']}>
                                <p>Transaction Status</p>
                                <p>{transaction?.status}</p>
                            </div>
                        </div>

                        <div className={styles['modal_content']}>
                            <div className={styles['transaction_modal_title']}>
                                <p>Additional Details</p>
                            </div>
                            
                            <div className={styles['others']}>
                                <p>Cryptocurrency</p>
                                <p>{transaction?.wallet_name}</p>
                            </div>

                            <div className={styles['others']}>
                                <p>From</p>
                                <p>{transaction?.from}</p>
                            </div>

                            <div className={styles['others']}>
                                <p>Reference ID</p>
                                <p>{transaction && transaction.reference_id.length > 20 ? transaction.reference_id.slice(0, 20) + '...': transaction.reference_id } <span className='btn btn-normal bi bi-copy small p-0' onClick={() => copyReferenceId(transaction.reference_id)}></span></p>
                            </div>

                            <div className={styles['others']}>
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