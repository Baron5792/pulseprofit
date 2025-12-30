import { useEffect } from 'react';
import styles from '../../assets/css/admin/Dashboard.module.css';
import { useState } from 'react';
import { toast } from 'react-toastify';

const DashboardOverview = () => {

    // fetch every deposit (pending too)
    const [deposit, setDeposit] = useState(null);
    const fetchDeposits = async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/deposit_overview.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
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



    // fetch every withdrawal including pendings
    const [withdrawal, setWithdrawal] = useState(null);
    const fetchWithdrawal = async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/withdrawal_overview.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setWithdrawal(request.data);
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'something wrong'});
                setWithdrawal(null);
            }
        }

        catch (error) {
            toast.error('Network error', {toastId: 'network-error'});
        }
    }



    // fetch every registered user
    const [users, setUsers] = useState(null);
    const fetchUsers = async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/users_overview.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                 },
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setUsers(request.data);
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'something wrong'});
                setUsers(null);
            }
        }

        catch (error) {
            toast.error('Network error', {toastId: 'network-error'});
        }
    }

    
    // fetch unreplied messages on component mount
    const [contactMessages, setContactMessages] = useState(null);
    const fetchMessages = async() => {
        try {
            const response = await fetch (`${import.meta.env.VITE_APP_API_URL}admin/fetch/contact_us_overview.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                 },
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setContactMessages(request.data);
            }

            else {
                toast.error(request.message || 'Something went wrong', {toastId: 'something wrong'});
                setContactMessages(null);
            }
        }

        catch (error) {
            toast.error('Network error', {toastId: 'network-error'});
        }
    }

    useEffect(() => {
        fetchDeposits();
        fetchWithdrawal();
        fetchUsers();
        fetchMessages();
    }, [])
    return (
        <>
            <div className={styles['container-fluid']}>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={styles['overview']}>
                            <div className="d-flex">
                                <p className={styles['overview_icon']}>
                                    <span className='bi bi-coin'></span>
                                </p>
                                <div className={styles['overview_description']}>
                                    <p>Total Deposits</p>
                                    {deposit && (
                                        <>
                                            <p>$ {formatCurrency(deposit.total_deposit)}</p>
                                            <small>+{deposit?.pending} pending</small>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* total withdrawal */}
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={styles['overview']}>
                            <div className="d-flex">
                                <p className={styles['overview_icon']}>
                                    <span className='bi bi-graph-down'></span>
                                </p>
                                <div className={styles['overview_description']}>
                                    <p>Total Withdrawal</p>
                                    {withdrawal && (
                                        <>
                                            <p>$ {formatCurrency(withdrawal.total_withdrawal)}</p>
                                            <small>+{withdrawal.row} pending</small>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* total registered users */}
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={styles['overview']}>
                            <div className="d-flex">
                                <p className={styles['overview_icon']}>
                                    <span className='bi bi-people-fill'></span>
                                </p>
                                <div className={styles['overview_description']}>
                                    <p>Registered Users</p>
                                   {users && (
                                        <>
                                             <p>{users.total_users}</p>
                                            <small>+{users.users_today} new</small>
                                        </>
                                   )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-12 col-lg-3">
                        <div className={styles['overview']}>
                            <div className="d-flex">
                                <p className={styles['overview_icon']}>
                                    <span className='bi bi-patch-check-fill'></span>
                                </p>
                                <div className={styles['overview_description']}>
                                    {contactMessages && (
                                        <>
                                            <p>Contact Us</p>
                                            <p>{contactMessages.total_messages}</p>
                                            <small className='text-danger'>+{contactMessages.unreplied_messages} new</small>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default DashboardOverview;