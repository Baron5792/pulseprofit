import { useCallback, useEffect, useState } from 'react';
import styles from '../../assets/css/admin/Dashboard.module.css';
import DashboardOverview from '../../component/admin/DasboardOverview';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { useCsrfToken } from '../../component/middleware/Csrf-token';
import Swal from 'sweetalert2';

const AdminDeposit = () => {

    // fetch deposits
    const [deposit, setDeposit] = useState(null);
    const { csrfToken, refreshCsrfToken } = useCsrfToken();
    const fetchDeposits = useCallback(async () => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/deposits.php`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const request = await response.json();
            if (request.status === 'success') {
                setDeposit(request.data);
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'something wrong'});
                setDeposit(null);
            }
        }

        catch (error) {
            toast.error('Network error', {toastId: 'network-error'});
            setDeposit(null);
        }
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

    useEffect(() => {
        document.title = `Deposit - ${import.meta.env.VITE_APP_NAME}`;
        fetchDeposits();
        refreshCsrfToken();
    }, [fetchDeposits])


    // for modal
    const [modal, setModal] = useState(false);
    const [modalData, settModalData] = useState(null);
    const openDepositModal = async(depositId) => {
        setModal(true);
        try {
            const depositDetails = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/fetch/deposit_data.php?deposit_id=${depositId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const depositReturn = await depositDetails.json();
            if (depositReturn.status === 'success') {
                settModalData(depositReturn.data);
            }

            else {
                toast.error(depositReturn.message, {toastId: 'retrun'});
                settModalData(null);
                setModal(false);
            }
        }

        catch (error) {
            toast.error('Something went wrong', {toastId: 'network-error'});
            settModalData(null);
            setModal(false);
        }
    }

    const closeModal = () => {
        setModal(false);
        settModalData(null);
    }

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const getFilteredTransactions = () => {
        if (!deposit) return null; // Use null to distinguish between loading and empty results
        if (!searchTerm) return deposit; 
        
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return deposit.filter(item => {
            // Search in multiple fields 
            const walletMatch = item.wallet_name.toLowerCase().includes(lowerCaseSearchTerm);
            const amountString = String(item.amount);
            const amountMatch = amountString.includes(lowerCaseSearchTerm);
            const statusMatch = item.status.toLowerCase().includes(lowerCaseSearchTerm);
            return walletMatch || amountMatch || statusMatch;
        });
    };

    const filteredData = getFilteredTransactions();

    // accept deposit
    const acceptDeposit = async(reference_id, userId) => {
        const SwalAlert = await Swal.fire({
            title: 'Are you sure?',
            html: '<small class"">This process cannot be reversed</small>',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: 'lightcoral',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Yes, proceed'
        })

        if (SwalAlert.isConfirmed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/update/accept_deposit.php`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken
                    },
                    body: JSON.stringify({ reference_id: reference_id, userId: userId })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    toast.success('Deposit has been accepted successfully', {toastId: 'accepted'});
                    setModal(false);
                    settModalData(false);
                    fetchDeposits();
                }   

                else {
                    toast.error(request.message || 'Something went wrong', {toastId: 'something-error'});
                    fetchDeposits();
                }
            }

            catch (error) {
                toast.error('Something went wrong', {toastId: 'network error'});
            }
        }
    }

    // decline deposit
    const declineDeposit = async(reference_id, userId) => {
        const swalAlert = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Return',
            cancelButtonColor: 'lightcoral',
            confirmButtonColor: 'lightgreen',
            confirmButtonText: 'Proceed'
        })

        if (swalAlert.isConfirmed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}admin/update/decline-deposit.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ reference_id: reference_id, userId: userId })
                })

                const request = await response.json();
                if (request.status === 'success') {
                    toast.success('Deposit has been successfully declined');
                    setModal(false);
                    fetchDeposits();
                    settModalData(null);
                }

                else {
                    toast.error(request.message || "Something went wrong", {toastId: 'something-error'});
                    fetchDeposits();
                }
            }

            catch (error) {
                toast.error('Something went wrong', {toastId: 'network-error'});
            }
        }
    }

    return (
        <>
            {/*  */}
            <div className={styles['page_title']}>
                <p>Deposit Overview</p>
            </div>

            {/* overview */}
            <DashboardOverview />

            {/* search bar */}
            <div className={styles['search_engine']}>
                <input type="text" onChange={handleSearchChange} className='form-control' placeholder='Search with deposit amount or status' />
            </div>


            {/* fetch deposits */}
            <div className={styles['table_container']}>
                <table className={styles['deposit_table']}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Amount <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>TXN ID <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Wallet Name <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Status <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th>Date <span className='bi-arrow-down-up small' style={{ color: 'lightcoral' }}></span></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposit && deposit.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}.</td>
                                    <td>{item?.fullname}</td>
                                    <td>${formatCurrency(item?.amount)}</td>
                                    <td>{item?.txn_id}</td>
                                    <td>{item?.wallet_name}</td>
                                    <td>{item.status}</td>
                                    <td>{new Date(item?.date).toLocaleDateString()}</td>
                                    <th>
                                        <button onClick={() => openDepositModal(item.id)} className='btn btn-normal bi bi-three-dots text-secondary'></button>
                                    </th>
                                </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan={9}>No deposit found</td>
                            </tr>
                        )}
                            
                    </tbody>
                </table>
            </div>


            {/* display modal */}
            {modalData && (
                <Modal show={modal} className='modal-lg'>
                    <Modal.Title>
                        <div className={styles['modal_title']}>
                            <p>#TXN{modalData?.txn_id}</p>
                            <button onClick={closeModal} type="button" className='btn btn-normal bi bi-x'></button>
                        </div>
                    </Modal.Title>
                    <Modal.Body>
                        <div className={styles['modal_body']}>
                            <div className={styles['modal_details']}>
                                <p>Full Name</p>
                                <p>{modalData?.fullname}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>E-Mail</p>
                                <p>{modalData?.email}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Wallet</p>
                                <p>{modalData?.wallet_name}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Wallet</p>
                                <p>$ {formatCurrency(modalData?.amount)}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Currency</p>
                                <p>{modalData?.wallet}</p>
                            </div>
                            <div className={styles['modal_details']}>
                                <p>Status</p>
                                <p>{modalData?.status}</p>
                            </div>
                            {/* screenshot display */}
                            <div className={styles['proof']}>
                                <img src={`${import.meta.env.VITE_APP_AVATAR}deposit_screenshot/${modalData?.screenshot}`} alt="__blank" />
                            </div>

                            {/* modal buttons */}
                            {modalData.status === 'PENDING' ? (
                                <div className={`${styles['modal_buttons']} container-fluid`}>
                                    <div className="row">
                                        <div className="col-6 col-md-6col-lg-6">
                                            <button onClick={() => acceptDeposit(modalData.reference_id, modalData.userId)} type='button' className={`${styles['accept_btn']} form-control`}>Accept</button>
                                        </div>
                                        <div className="col-6 col-md-6col-lg-6">
                                            <button type='button' onClick={() => declineDeposit(modalData.reference_id, modalData.userId)} className={`${styles['decline_btn']} form-control`}>Decline</button>
                                        </div>
                                    </div>
                                </div>
                            ): (
                                <>
                                    <small>Action has been taken already</small>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    )
}


export default AdminDeposit;